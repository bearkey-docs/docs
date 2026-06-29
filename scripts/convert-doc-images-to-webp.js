const fs = require('fs');
const path = require('path');
const {execFileSync, spawnSync} = require('child_process');

const siteDir = path.join(__dirname, '..');
const docsRoots = [path.join(siteDir, 'docs_cn'), ...getLocalizedDocsRoots()];
const markdownImageRe = /(!\[[^\]]*\]\()([^\s)]+)([^)]*\))/g;
const convertibleImageRe = /\.(png|jpe?g)$/i;
const webpQuality = process.env.DOC_IMAGE_WEBP_QUALITY || '82';

function getLocalizedDocsRoots() {
  const i18nDir = path.join(siteDir, 'docs_en');

  if (!fs.existsSync(i18nDir)) {
    return [];
  }

  return fs
    .readdirSync(i18nDir, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) =>
      path.join(
        i18nDir,
        entry.name,
        'docusaurus-plugin-content-docs',
        'current',
      ),
    )
    .filter((docsRoot) => fs.existsSync(docsRoot));
}

function commandExists(command) {
  const result = spawnSync('command', ['-v', command], {
    shell: true,
    stdio: 'ignore',
  });

  return result.status === 0;
}

function splitImageUrl(imageUrl) {
  const splitIndex = imageUrl.search(/[?#]/);

  if (splitIndex === -1) {
    return {imagePath: imageUrl, suffix: ''};
  }

  return {
    imagePath: imageUrl.slice(0, splitIndex),
    suffix: imageUrl.slice(splitIndex),
  };
}

function isLocalImagePath(imagePath) {
  return (
    !imagePath.startsWith('/') &&
    !imagePath.startsWith('#') &&
    !/^[a-z][a-z0-9+.-]*:/i.test(imagePath)
  );
}

function convertImage(imagePath, webpPath) {
  fs.mkdirSync(path.dirname(webpPath), {recursive: true});
  execFileSync('cwebp', ['-quiet', '-q', webpQuality, imagePath, '-o', webpPath], {
    stdio: 'inherit',
  });
}

function processMarkdownFile(markdownPath) {
  const markdownDir = path.dirname(markdownPath);
  const source = fs.readFileSync(markdownPath, 'utf8');
  let changed = false;
  const nextSource = source.replace(
    markdownImageRe,
    (fullMatch, prefix, imageUrl, suffix) => {
      const {imagePath, suffix: urlSuffix} = splitImageUrl(imageUrl);

      if (!isLocalImagePath(imagePath) || !convertibleImageRe.test(imagePath)) {
        return fullMatch;
      }

      const sourceImagePath = path.resolve(markdownDir, decodeURI(imagePath));
      const webpImagePath = sourceImagePath.replace(convertibleImageRe, '.webp');

      if (!fs.existsSync(sourceImagePath)) {
        return fullMatch;
      }

      if (!fs.existsSync(webpImagePath)) {
        convertImage(sourceImagePath, webpImagePath);
      }

      fs.unlinkSync(sourceImagePath);
      changed = true;

      return `${prefix}${imagePath.replace(convertibleImageRe, '.webp')}${urlSuffix}${suffix}`;
    },
  );

  if (changed) {
    fs.writeFileSync(markdownPath, nextSource);
    console.log(`Converted image references in ${path.relative(siteDir, markdownPath)}`);
  }
}

function walk(dirPath) {
  for (const entry of fs.readdirSync(dirPath, {withFileTypes: true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }

    if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      processMarkdownFile(entryPath);
    }
  }
}

if (!commandExists('cwebp')) {
  console.warn('Skipping doc image WebP conversion because cwebp is not installed.');
  process.exit(0);
}

for (const docsRoot of docsRoots) {
  if (fs.existsSync(docsRoot)) {
    walk(docsRoot);
  }
}
