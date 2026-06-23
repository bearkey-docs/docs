const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..');
const docsRoots = [
  path.join(siteDir, 'docs'),
  ...getLocalizedDocsRoots(),
];

function getLocalizedDocsRoots() {
  const i18nDir = path.join(siteDir, 'i18n');

  if (!fs.existsSync(i18nDir)) {
    return [];
  }

  return fs
    .readdirSync(i18nDir, { withFileTypes: true })
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

function titleFromDirName(dirName) {
  return dirName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasDocContent(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).some((entry) => {
    if (entry.name.startsWith('.')) {
      return false;
    }

    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      return hasDocContent(entryPath);
    }

    return entry.isFile() && /\.(md|mdx)$/i.test(entry.name);
  });
}

function ensureCategoryFile(dirPath) {
  const categoryPath = path.join(dirPath, '_category_.json');

  if (fs.existsSync(categoryPath) || !hasDocContent(dirPath)) {
    return;
  }

  const label = titleFromDirName(path.basename(dirPath));
  const category = {
    label,
    position: 100,
    collapsed: false,
  };

  fs.writeFileSync(categoryPath, `${JSON.stringify(category, null, 2)}\n`);
  console.log(`Created ${path.relative(path.join(__dirname, '..'), categoryPath)}`);
}

function walk(dirPath) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }

    const childPath = path.join(dirPath, entry.name);
    ensureCategoryFile(childPath);
    walk(childPath);
  }
}

for (const docsRoot of docsRoots) {
  if (!fs.existsSync(docsRoot)) {
    throw new Error(`Docs directory not found: ${docsRoot}`);
  }

  walk(docsRoot);
}
