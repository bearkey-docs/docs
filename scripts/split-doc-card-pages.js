const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..');
const docsRoots = [
  path.join(siteDir, 'docs_cn'),
  ...getLocalizedDocsRoots(),
];
const generatedDir = path.join(siteDir, 'src', 'generated');
const generatedSplitSourcesPath = path.join(generatedDir, 'splitDocSourceIds.json');
const generatedSplitCardItemsPath = path.join(generatedDir, 'splitDocCardItems.json');

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

function normalizeHeadingText(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
        title: normalizeHeadingText(heading[1]),
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
    parentTitle: firstH1
      ? normalizeHeadingText(firstH1.replace(/^#\s+/, ''))
      : undefined,
    sections,
  };
}

function rewriteRelativeLinks(content) {
  const shiftRelativeUrl = (url) =>
    /^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(url) ? url : `../${url}`;

  return content
    .replace(
      /(!?\[[^\]]*]\()([^)\s]+)([^)]*\))/g,
      (match, open, url, close) => `${open}${shiftRelativeUrl(url)}${close}`,
    )
    .replace(
      /(<[^>]+\s(?:src|href)=["'])([^"']+)(["'])/gi,
      (match, open, url, close) => `${open}${shiftRelativeUrl(url)}${close}`,
    );
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
    editUrl: false,
  };
  const parentSource = [
    stringifyFrontMatter(parentFrontMatter),
    '',
    'import AutoDocCardList from \'@site/src/components/AutoDocCardList\';',
    '',
    `# ${parentLabel}`,
    '',
    '<AutoDocCardList />',
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
      editUrl: false,
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

}

function writeGeneratedSplitSources(sourceIds) {
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(
    generatedSplitSourcesPath,
    `${JSON.stringify([...sourceIds].sort(), null, 2)}\n`,
  );
}

function writeGeneratedSplitCardItems(cardItemsBySourceId) {
  fs.mkdirSync(generatedDir, { recursive: true });
  const sortedEntries = Object.fromEntries(
    [...cardItemsBySourceId.entries()].sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );

  fs.writeFileSync(
    generatedSplitCardItemsPath,
    `${JSON.stringify(sortedEntries, null, 2)}\n`,
  );
}

function collectGeneratedSplitMetadata() {
  const sourceIds = new Set();
  const cardItemsBySourceId = new Map();

  function walk(dirPath) {
    const markerPath = path.join(dirPath, '.split-doc-generated');

    if (fs.existsSync(markerPath)) {
      const sourceDocId = fs.readFileSync(markerPath, 'utf8').trim();

      if (!sourceDocId) {
        throw new Error(`Empty split-doc marker: ${markerPath}`);
      }

      const pages = fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((entry) => {
          if (!entry.isFile() || !isMarkdownFile(entry.name)) {
            return false;
          }

          const pageName = path.parse(entry.name).name.toLowerCase();
          return pageName !== 'readme' && pageName !== 'index';
        })
        .map((entry) => {
          const filePath = path.join(dirPath, entry.name);
          const source = fs.readFileSync(filePath, 'utf8');
          const { frontMatter, body } = parseFrontMatter(source);
          const firstH1 = body.split(/\r?\n/).find((line) => /^#\s+/.test(line));
          const label =
            frontMatter.sidebar_label ||
            frontMatter.title ||
            (firstH1
              ? normalizeHeadingText(firstH1.replace(/^#\s+/, ''))
              : path.parse(entry.name).name);
          const parsedPosition = Number(frontMatter.sidebar_position);

          return {
            fileName: entry.name,
            sidebarPosition: Number.isFinite(parsedPosition)
              ? parsedPosition
              : Number.POSITIVE_INFINITY,
            cardItem: {
              type: 'link',
              label: String(label),
              href: `${path.basename(dirPath)}/${path.parse(entry.name).name}`,
            },
          };
        })
        .sort((left, right) => {
          if (left.sidebarPosition !== right.sidebarPosition) {
            return left.sidebarPosition - right.sidebarPosition;
          }

          return left.fileName.localeCompare(right.fileName, undefined, {
            numeric: true,
          });
        });

      sourceIds.add(sourceDocId);
      cardItemsBySourceId.set(
        sourceDocId,
        pages.map((page) => page.cardItem),
      );
      return;
    }

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) {
        continue;
      }

      walk(path.join(dirPath, entry.name));
    }
  }

  for (const docsRoot of docsRoots) {
    walk(docsRoot);
  }

  return { sourceIds, cardItemsBySourceId };
}

for (const docsRoot of docsRoots) {
  for (const splitSource of collectSplitSources(docsRoot)) {
    writeSplitDoc(docsRoot, splitSource);

    // 拆分完成后删除源码 md，生成的子页面就是最终文档
    fs.unlinkSync(splitSource.filePath);
  }
}

// 每次都以带标记的拆分页目录为准重建元数据。
// 因此直接新增、删除或修改 01.md、02.md 等页面时无需手工维护 JSON。
const { sourceIds, cardItemsBySourceId } = collectGeneratedSplitMetadata();
writeGeneratedSplitSources(sourceIds);
writeGeneratedSplitCardItems(cardItemsBySourceId);
