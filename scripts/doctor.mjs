// scripts/doctor.mjs
// Compatibility and anti-breakage diagnostic tool for Antigravity IDE updates

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Locate editor install
export function findEditorPath() {
  const args = process.argv.slice(2);
  const appIdx = args.indexOf('--app');
  if (appIdx !== -1 && args[appIdx + 1]) {
    return path.resolve(args[appIdx + 1]);
  }

  // Common OS locations for Antigravity IDE
  const candidates = [
    '/Applications/Antigravity IDE.app',
    '/Applications/Antigravity.app',
    path.join(process.env.HOME || '', 'Applications', 'Antigravity IDE.app'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Antigravity IDE'),
    '/usr/share/antigravity-ide'
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

// 2. Read editor metadata
export function getEditorMetadata(appPath) {
  let appDir = appPath;
  if (appPath.endsWith('.app')) {
    appDir = path.join(appPath, 'Contents', 'Resources', 'app');
  }

  const productJsonPath = path.join(appDir, 'product.json');
  const packageJsonPath = path.join(appDir, 'package.json');

  let product = {};
  let pkg = {};

  try {
    if (fs.existsSync(productJsonPath)) {
      product = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
    }
  } catch (err) {
    console.warn(`[doctor] Warning reading product.json: ${err.message}`);
  }

  try {
    if (fs.existsSync(packageJsonPath)) {
      pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    }
  } catch (err) {
    console.warn(`[doctor] Warning reading package.json: ${err.message}`);
  }

  const editorVersion = product.version || pkg.version || 'unknown';
  const name = product.nameLong || product.nameShort || pkg.name || 'Antigravity IDE';
  const vscodeVersion = product.vscodeVersion || pkg.version || editorVersion;
  const mainJsPath = path.join(appDir, 'out', 'vs', 'workbench', 'workbench.desktop.main.js');

  return {
    name,
    version: editorVersion,
    vscodeVersion,
    appDir,
    mainJsPath
  };
}

// 3. Extract registered colors and icons from bundled workbench JS
export function extractRegistrations(mainJsPath, version) {
  const cacheDir = path.join(rootDir, '.cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${version}.json`);

  if (fs.existsSync(cachePath)) {
    console.log(`[doctor] Loading cached registry analysis from .cache/${version}.json`);
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  console.log(`[doctor] Scanning bundled workbench: ${mainJsPath}`);
  if (!fs.existsSync(mainJsPath)) {
    console.warn(`[doctor] Warning: workbench.desktop.main.js not found at ${mainJsPath}`);
    return { colors: [], icons: [] };
  }

  const content = fs.readFileSync(mainJsPath, 'utf8');

  // Match all color registrations via registerColor functions and ANSI terminal map
  const colorsSet = new Set();
  const colorFnRegex = /\b(?:Te|je)\(\s*["\x27]([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)*)["\x27]/g;
  let m;
  while ((m = colorFnRegex.exec(content)) !== null) {
    colorsSet.add(m[1]);
  }

  const ansiRegex = /["\x27](terminal\.ansi[A-Za-z]+)["\x27]/g;
  while ((m = ansiRegex.exec(content)) !== null) {
    colorsSet.add(m[1]);
  }

  // Icon registration pattern: functionName("icon-id", [56][0-9]{4})
  const iconsSet = new Set();
  const iconRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\(\s*["\x27]([a-z0-9-]+)["\x27]\s*,\s*([56][0-9]{4})\s*\)/g;
  while ((m = iconRegex.exec(content)) !== null) {
    iconsSet.add(m[1]);
  }

  const result = {
    editorVersion: version,
    scannedAt: new Date().toISOString(),
    colors: Array.from(colorsSet).sort(),
    icons: Array.from(iconsSet).sort()
  };

  fs.writeFileSync(cachePath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[doctor] Cached ${result.colors.length} color keys and ${result.icons.length} icon IDs to .cache/${version}.json`);

  return result;
}

export function runDoctor() {
  console.log('=== Carbonline Doctor ===\n');

  const appPath = findEditorPath();
  if (!appPath) {
    console.error('[doctor] Error: Could not locate Antigravity IDE installation.');
    console.error('[doctor] Please pass the path using: node scripts/doctor.mjs --app <path>');
    process.exit(2);
  }

  const meta = getEditorMetadata(appPath);
  console.log(`Editor:          ${meta.name}`);
  console.log(`Version:         ${meta.version}`);
  console.log(`Base VS Code:    ${meta.vscodeVersion}`);
  console.log(`App Path:        ${appPath}\n`);

  // Check engines compatibility
  const pkgManifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const engineFloor = pkgManifest.engines?.vscode?.replace(/[^0-9.]/g, '') || '1.85.0';

  let hasEngineMismatch = false;
  if (meta.vscodeVersion !== 'unknown') {
    const semverCompare = meta.vscodeVersion.localeCompare(engineFloor, undefined, { numeric: true });
    if (semverCompare < 0) {
      console.warn(`[doctor] Warning: Installed version ${meta.vscodeVersion} is below engine floor ${engineFloor}`);
      hasEngineMismatch = true;
    }
  }

  // Extract known keys from editor
  const registry = extractRegistrations(meta.mainJsPath, meta.version);
  const editorColors = new Set(registry.colors);
  const editorIcons = new Set(registry.icons);

  // Write known product icons for validator reference
  if (registry.icons.length > 0) {
    const knownIconsPath = path.join(rootDir, 'src', 'known-product-icon-ids.json');
    fs.writeFileSync(knownIconsPath, JSON.stringify(registry.icons, null, 2), 'utf8');
  }

  // Read our workbench colors
  const themePath = path.join(rootDir, 'themes', 'tbm-theme.json');
  let ourKeys = [];
  if (fs.existsSync(themePath)) {
    const themeObj = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    ourKeys = Object.keys(themeObj.colors || {});
  } else {
    const workbenchMapPath = path.join(rootDir, 'src', 'workbench-map.json');
    const ourMap = JSON.parse(fs.readFileSync(workbenchMapPath, 'utf8'));
    ourKeys = Object.keys(ourMap);
  }

  // Diff analysis
  const staleKeys = ourKeys.filter((k) => editorColors.size > 0 && !editorColors.has(k));
  const newKeys = Array.from(editorColors).filter((k) => !ourKeys.includes(k));

  // Prioritize new keys by high-impact UI areas
  const priorityPrefixes = ['chat.', 'agent', 'editor.', 'sideBar.', 'tab.', 'activityBar.'];
  const priorityNewKeys = newKeys.filter((k) => priorityPrefixes.some((p) => k.startsWith(p)));

  console.log('--- Health Summary ---');
  console.log(`Our Defined Colors:    ${ourKeys.length}`);
  console.log(`Editor Known Colors:   ${editorColors.size}`);
  console.log(`Stale Keys (Obsolete): ${staleKeys.length}`);
  console.log(`New Unset Keys:        ${newKeys.length} (${priorityNewKeys.length} priority UI surfaces)`);

  // Markdown Report Output
  const reportPath = path.join(rootDir, 'doctor-report.md');
  const report = [
    '# TBM Theme Doctor Report',
    '',
    `*Generated on: ${new Date().toLocaleString()}*`,
    '',
    '## Environment',
    `- **Editor**: ${meta.name}`,
    `- **Version**: ${meta.version}`,
    `- **Underlying VS Code Base**: ${meta.vscodeVersion}`,
    `- **Engine Floor**: \`${pkgManifest.engines?.vscode}\``,
    `- **Status**: ${hasEngineMismatch ? '⚠️ Engine Warning' : '✅ Compatible'}`,
    '',
    '## Registry Compatibility',
    `- **Our Defined Colors**: ${ourKeys.length}`,
    `- **Editor Known Colors**: ${editorColors.size}`,
    `- **Stale Keys**: ${staleKeys.length}`,
    `- **New / Unstyled Keys in Editor**: ${newKeys.length}`,
    '',
    '### Stale Keys (Set by us, but dropped by editor)',
    staleKeys.length === 0 ? '- None. All defined keys are valid.' : staleKeys.map((k) => `- \`${k}\``).join('\n'),
    '',
    '### Priority New Keys (Recommended to style in next pass)',
    priorityNewKeys.length === 0 ? '- None.' : priorityNewKeys.slice(0, 30).map((k) => `- \`${k}\``).join('\n'),
    '',
    '## Health Verdict',
    staleKeys.length > 0 || hasEngineMismatch
      ? '❌ **ERRORS DETECTED**: Run review before deploying update.'
      : newKeys.length > 0
        ? '⚠️ **HEALTHY WITH WARNINGS**: Minor unthemed surfaces detected.'
        : '✅ **PERFECT HEALTH**: 100% aligned with installed editor.'
  ].join('\n');

  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\n[doctor] Report saved to: ${reportPath}`);

  // Record last good version
  if (staleKeys.length === 0 && !hasEngineMismatch) {
    const lastGoodPath = path.join(rootDir, '.last-good-version');
    fs.writeFileSync(lastGoodPath, meta.version + '\n', 'utf8');
    console.log(`[doctor] Recorded last good version: ${meta.version}`);
  }

  // Determine exit code
  if (hasEngineMismatch || staleKeys.length > 0) {
    console.log('\nVerdict: Exit code 2 (Errors detected)');
    process.exit(2);
  } else if (newKeys.length > 0) {
    console.log('\nVerdict: Exit code 1 (Warnings / new unstyled surfaces)');
    process.exit(1);
  } else {
    console.log('\nVerdict: Exit code 0 (Healthy)');
    process.exit(0);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDoctor();
}
