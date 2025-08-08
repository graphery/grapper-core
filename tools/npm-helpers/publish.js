// /tools/npm-helpers/publish.js
import fs                from 'node:fs';
import os                from 'node:os';
import path              from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync }      from 'node:child_process';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const rootDir    = path.resolve(__dirname, '../../');
const pkgPath    = path.join(rootDir, 'package.json');
const backupPath = path.join(rootDir, 'package.json.backup');
const readJson   = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

console.log('🧹 Cleaning package.json (remove scripts/devDependencies)...');

if (!fs.existsSync(pkgPath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

// Backup original package.json
const pkgOriginal = fs.readFileSync(pkgPath, 'utf8');
fs.writeFileSync(backupPath, pkgOriginal, 'utf8');

// Create cleaned package.json (no scripts, no devDependencies)
const pkgData   = readJson(pkgPath);
pkgData.scripts = {
  "postinstall" : "node tools/npm-helpers/copy.js"
};
delete pkgData.devDependencies;
fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2), 'utf8');
console.log('✅ package.json cleaned');

// Create a temporary directory for npm pack output
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'grapper-core-publish-'));
console.log(`📁 Using temp directory: ${ tmpDir }`);

// Run npm pack into the temp directory and capture the produced filename
console.log('📦 Running `npm pack` to generate the tarball...');
let tarballName;
try {
  // npm pack prints the tarball name on stdout (last line)
  const out   = execSync(`npm pack --pack-destination "${ tmpDir }"`, {
    cwd      : rootDir,
    stdio    : ['ignore', 'pipe', 'inherit'],
    encoding : 'utf8',
  });
  tarballName = out.trim().split('\n').pop();
  if (!tarballName || !tarballName.endsWith('.tgz')) {
    throw new Error(`Unexpected npm pack output: "${ out }"`);
  }
  console.log(`🗜️  Pack created: ${ tarballName }`);
} catch (err) {
  console.error('❌ Failed to run `npm pack`:', err.message);
  // Restore original package.json before exiting
  fs.writeFileSync(pkgPath, pkgOriginal, 'utf8');
  fs.rmSync(tmpDir, {recursive : true, force : true});
  process.exit(1);
}

// Publish the generated tarball with public access
const tarballPath = path.join(tmpDir, tarballName);
try {
  console.log('🚀 Publishing tarball to NPM (public access)...');
  execSync(`npm publish --access public "${ tarballPath }"`, {
    cwd   : rootDir,
    stdio : 'inherit',
  });
  console.log('✅ Publish completed');
} catch (err) {
  console.error('❌ Error during publish:', err.message);
} finally {
  // Restore the original package.json
  fs.writeFileSync(pkgPath, pkgOriginal, 'utf8');
  console.log('🔄 Restored original package.json');

  // Clean up temp directory and cache file
  try {
    // fs.rmSync(tmpDir, {recursive : true, force : true});
    if (fs.existsSync(backupPath)) {
      fs.cpSync(backupPath, pkgPath);
      fs.rmSync(backupPath, {force : true});
    }
    console.log('🧽 Cleaned up temporary files');
  } catch (e) {
    // best-effort cleanup
    console.log('❌ Error during cleaning up temporary files...', e.message);
  }
}
