// scripts/install.mjs
// Automates: build -> validate -> vsce package -> agy-ide --install-extension

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const vsixName = `${pkg.name}-${pkg.version}.vsix`;
const vsixPath = path.join(rootDir, vsixName);

console.log('[install] Building and validating TBM Theme...');
execSync('npm run build && npm run validate', { cwd: rootDir, stdio: 'inherit' });

console.log('[install] Packaging extension VSIX...');
execSync('npx @vscode/vsce package --no-dependencies --allow-missing-repository', { cwd: rootDir, stdio: 'inherit' });

console.log(`[install] Installing ${vsixPath} into Antigravity IDE...`);
try {
  execSync(`agy-ide --install-extension "${vsixPath}" --force`, { cwd: rootDir, stdio: 'inherit' });
  console.log('[install] Successfully installed extension into Antigravity IDE!');
  console.log('[install] To activate: open Command Palette (Cmd+Shift+P) -> "Preferences: Color Theme" -> select "TBM Theme"');
} catch (err) {
  console.warn('[install] Automatic CLI install failed or CLI not found.');
  console.log('[install] Manual install steps:');
  console.log('  1. Open Antigravity IDE');
  console.log('  2. Press Cmd+Shift+P -> "Extensions: Install from VSIX..."');
  console.log(`  3. Select: ${vsixPath}`);
}
