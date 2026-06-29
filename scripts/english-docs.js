const fs = require('fs');
const path = require('path');

const ENGLISH_LOCALE = 'en';
const ENGLISH_DOCS_ROOT = path.join(
  __dirname,
  '..',
  'docs_en',
  ENGLISH_LOCALE,
  'docusaurus-plugin-content-docs',
  'current',
);
const DOC_FILE_EXTENSIONS = new Set(['.md', '.mdx']);

function normalizeDocId(docId) {
  return docId.replace(/\\/g, '/').replace(/\/index$/, '');
}

function getDocIdFromFile(docsRoot, filePath) {
  const relativePath = path.relative(docsRoot, filePath).replace(/\\/g, '/');
  const parsedPath = path.parse(relativePath);
  return normalizeDocId(path.join(parsedPath.dir, parsedPath.name));
}

function collectDocIds(docsRoot) {
  const docIds = [];

  function collect(dirPath) {
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === '_category_.json') {
        continue;
      }

      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        collect(entryPath);
        continue;
      }

      if (entry.isFile() && DOC_FILE_EXTENSIONS.has(path.extname(entry.name))) {
        docIds.push(getDocIdFromFile(docsRoot, entryPath));
      }
    }
  }

  if (fs.existsSync(docsRoot)) {
    collect(docsRoot);
  }

  return new Set(docIds);
}

const ENGLISH_DOC_IDS = collectDocIds(ENGLISH_DOCS_ROOT);

function isEnglishBuild() {
  return process.env.DOCUSAURUS_CURRENT_LOCALE === ENGLISH_LOCALE;
}

function hasEnglishDoc(docId) {
  return ENGLISH_DOC_IDS.has(normalizeDocId(docId));
}

module.exports = {
  hasEnglishDoc,
  isEnglishBuild,
};
