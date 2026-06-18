const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

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

if (!fs.existsSync(docsDir)) {
  throw new Error(`Docs directory not found: ${docsDir}`);
}

walk(docsDir);
