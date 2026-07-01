const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..');
const docsRoots = [
  path.join(siteDir, 'docs_cn'),
  ...getLocalizedDocsRoots(),
];
const generatedDir = path.join(siteDir, 'src', 'generated');
const generatedSplitSourcesPath = path.join(generatedDir, 'splitDocSourceIds.json');

function getLocalizedDocsRoots() {
  const i18nDir = path.join(siteDir, 'docs_en');

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

function parseFrontMatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { frontMatter: {}, body: source };
  }

  const rawFrontMatter = match[1];
  const body = source.slice(match[0].length);
  const frontMatter = {};

  for (const line of rawFrontMatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!match) {
      continue;
    }

    frontMatter[match[1]] = normalizeFrontMatterValue(match[2]);
  }

  return { frontMatter, body };
}

function normalizeFrontMatterValue(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  return trimmed;
}

function stringifyFrontMatter(frontMatter) {
  const lines = Object.entries(frontMatter).map(([key, value]) => {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return `${key}: ${value}`;
    }

    return `${key}: ${quoteFrontMatterValue(String(value))}`;
  });

  return `---\n${lines.join('\n')}\n---\n\n`;
}

function quoteFrontMatterValue(value) {
  if (/^[A-Za-z0-9_./-]+$/.test(value)) {
    return value;
  }

  return JSON.stringify(value);
}

function getDocIdFromFile(docsRoot, filePath) {
  const relativePath = path.relative(docsRoot, filePath).replace(/\\/g, '/');
  const parsedPath = path.parse(relativePath);

  return path
    .join(parsedPath.dir, parsedPath.name)
    .replace(/\\/g, '/')
    .replace(/\/index$/, '');
}

function isMarkdownFile(fileName) {
  return /\.(md|mdx)$/i.test(fileName);
}

function collectSplitSources(docsRoot) {
  const sources = [];

  function walk(dirPath) {
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === '_category_.json') {
        continue;
      }

      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (!entry.isFile() || !isMarkdownFile(entry.name)) {
        continue;
      }

      const source = fs.readFileSync(entryPath, 'utf8');
      const { frontMatter, body } = parseFrontMatter(source);

      if (frontMatter.split_by_h2 === true) {
        sources.push({ filePath: entryPath, frontMatter, body });
      }
    }
  }

  walk(docsRoot);
  return sources;
}

function splitBodyByH2(body) {
  const lines = body.split(/\r?\n/);
  const firstH1 = lines.find((line) => /^#\s+/.test(line));
  const sections = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);

    if (heading) {
      if (current) {
        sections.push(current);
      }

      current = {
        title: heading[1].trim(),
        lines: [],
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return {
    parentTitle: firstH1 ? firstH1.replace(/^#\s+/, '').trim() : undefined,
    sections,
  };
}

function rewriteRelativeLinks(content) {
  return content.replace(/(!?\[[^\]]*]\()([^)\s]+)([^)]*\))/g, (match, open, url, close) => {
    if (
      /^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(url) ||
      url.startsWith('../')
    ) {
      return match;
    }

    return `${open}../${url}${close}`;
  });
}

function removeGeneratedOutput(outputDir) {
  if (!fs.existsSync(outputDir)) {
    return;
  }

  const markerPath = path.join(outputDir, '.split-doc-generated');

  if (!fs.existsSync(markerPath)) {
    throw new Error(`Refusing to overwrite non-generated directory: ${outputDir}`);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
}

function writeSplitDoc(docsRoot, splitSource) {
  const sourceDocId = getDocIdFromFile(docsRoot, splitSource.filePath);
  const outputDir = path.join(
    path.dirname(splitSource.filePath),
    path.basename(splitSource.filePath, path.extname(splitSource.filePath)),
  );
  const { parentTitle, sections } = splitBodyByH2(splitSource.body);

  if (sections.length === 0) {
    throw new Error(`split_by_h2 document has no H2 sections: ${splitSource.filePath}`);
  }

  removeGeneratedOutput(outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, '.split-doc-generated'), `${sourceDocId}\n`);

  const parentLabel =
    splitSource.frontMatter.sidebar_label ||
    splitSource.frontMatter.title ||
    path.basename(outputDir);
  const parentFrontMatter = {
    sidebar_position: splitSource.frontMatter.sidebar_position || 100,
    sidebar_label: parentLabel,
    title: splitSource.frontMatter.title || parentLabel,
    generated_from_split_doc: sourceDocId,
  };
  const cardItems = sections.map((section, index) => ({
    type: 'link',
    label: section.title,
    href: `${path.basename(outputDir)}/${String(index + 1).padStart(2, '0')}`,
  }));
  const parentSource = [
    stringifyFrontMatter(parentFrontMatter),
    "import DocCardList from '@theme/DocCardList';",
    '',
    `# ${parentLabel}`,
    '',
    '<DocCardList',
    `  items={${JSON.stringify(cardItems, null, 4)}}`,
    '/>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outputDir, 'README.md'), parentSource);

  sections.forEach((section, index) => {
    const fileName = `${String(index + 1).padStart(2, '0')}.md`;
    const sectionFrontMatter = {
      sidebar_position: index + 1,
      sidebar_label: section.title,
      title: parentTitle ? `${parentTitle} - ${section.title}` : section.title,
      generated_from_split_doc: sourceDocId,
    };
    const sectionBody = rewriteRelativeLinks(section.lines.join('\n').trim());
    const sectionSource = [
      stringifyFrontMatter(sectionFrontMatter),
      `# ${section.title}`,
      '',
      sectionBody,
      '',
    ].join('\n');

    fs.writeFileSync(path.join(outputDir, fileName), sectionSource);
  });

  return sourceDocId;
}

function writeGeneratedSplitSources(sourceIds) {
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(
    generatedSplitSourcesPath,
    `${JSON.stringify([...sourceIds].sort(), null, 2)}\n`,
  );
}

const splitSourceIds = new Set();

for (const docsRoot of docsRoots) {
  for (const splitSource of collectSplitSources(docsRoot)) {
    splitSourceIds.add(writeSplitDoc(docsRoot, splitSource));
  }
}

writeGeneratedSplitSources(splitSourceIds);
