// copy.js
import fs   from 'fs';
import path from 'path';

const projectRoot = process.env.INIT_CWD;

const srcCoreDest = path.join(projectRoot, 'src', 'core');

const moduleCoreSrc = path.join(projectRoot, 'node_modules', 'grapper-core', 'src', 'core');

// Remove directories
if (fs.existsSync(srcCoreDest)) {
  fs.rmdirSync(srcCoreDest, {recursive : true});
}

// Create directories
fs.mkdirSync(srcCoreDest, {recursive : true});

// Copy files
fs.cpSync(moduleCoreSrc, srcCoreDest, {recursive : true});

// Add to .gitignore
add2gitignore(['/src/core/']);

function add2gitignore (patterns) {

  const gitignorePath    = path.join(projectRoot, '.gitignore');
  const normalizePattern = (p) => p
    .replace(/\r/g, '')
    .trim()
    .replace(/^!/, '')
    .replace(/\\/g, '/')
    .replace(/\/+$/, '')
    .replace(/^\/+/, '');


  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
  }

  const lines              = content.split(/\r?\n/);
  const normalizedExisting = new Set(
    lines
      .filter(Boolean)
      .map(normalizePattern)
  );

  const toAppend = [];
  for (const raw of patterns) {
    const canonical = normalizePattern(raw); // e.g. 'src/core'
    const exists    =
            normalizedExisting.has(canonical) ||
            normalizedExisting.has(canonical + '/') ||
            normalizedExisting.has(canonical.replace(/\/+$/, '')) ||
            normalizedExisting.has(canonical.replace(/^\/+/, ''));

    if (!exists) {
      toAppend.push(raw);
      normalizedExisting.add(canonical);
    }
  }

  if (toAppend.length > 0) {
    const prefix     = content.length && !content.endsWith('\n') ? '\n' : '';
    const newContent = content + prefix + '# Added by grapper-core\n' + toAppend.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent, 'utf8');
  }
}