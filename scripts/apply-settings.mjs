// scripts/apply-settings.mjs
// Safely previews or pins TBM Theme & icons in Antigravity settings.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function findSettingsPath() {
  const args = process.argv.slice(2);
  const pathIdx = args.indexOf('--settings');
  if (pathIdx !== -1 && args[pathIdx + 1]) {
    return path.resolve(args[pathIdx + 1]);
  }

  const candidates = [
    path.join(process.env.HOME || '', 'Library', 'Application Support', 'Antigravity IDE', 'User', 'settings.json'),
    path.join(process.env.HOME || '', 'Library', 'Application Support', 'antigravity', 'User', 'settings.json'),
    path.join(process.env.HOME || '', '.config', 'Antigravity IDE', 'User', 'settings.json'),
    path.join(process.env.APPDATA || '', 'Antigravity IDE', 'User', 'settings.json')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

// Strip comments and trailing commas for robust JSONC parsing
function parseJsonc(text) {
  let cleaned = text.replace(/\/\/.*$/gm, '');
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(cleaned);
}

export function applySettings() {
  const args = process.argv.slice(2);
  const isApply = args.includes('--apply');
  const themeArgIdx = args.indexOf('--theme');
  const requestedTheme = (themeArgIdx !== -1 && args[themeArgIdx + 1]) ? args[themeArgIdx + 1] : 'TBM Theme';
  const iconThemeArgIdx = args.indexOf('--icon-theme');
  let requestedIconTheme = (iconThemeArgIdx !== -1 && args[iconThemeArgIdx + 1]) ? args[iconThemeArgIdx + 1] : null;
  if (!requestedIconTheme) {
    requestedIconTheme = requestedTheme.includes('Burgundy') ? 'tbm-burgundy-icons' : 'tbm-icons';
  }

  console.log('=== TBM Theme Settings Manager ===\n');

  const settingsPath = findSettingsPath();
  if (!settingsPath) {
    console.error('[apply-settings] Error: Could not locate user settings.json.');
    console.error('[apply-settings] Pass custom path via: node scripts/apply-settings.mjs --settings <path>');
    process.exit(1);
  }

  console.log(`Settings File: ${settingsPath}`);
  console.log(`Target Theme:  ${requestedTheme}`);
  console.log(`Mode:          ${isApply ? 'APPLY (Modifying settings)' : 'DRY RUN (Preview only)'}\n`);

  const rawContent = fs.readFileSync(settingsPath, 'utf8');
  let currentSettings = {};
  try {
    currentSettings = parseJsonc(rawContent);
  } catch (err) {
    console.error(`[apply-settings] Failed to parse JSONC from settings: ${err.message}`);
    process.exit(1);
  }

  const targetSettings = {
    'workbench.colorTheme': requestedTheme,
    'workbench.productIconTheme': 'tbm-outline',
    'workbench.iconTheme': requestedIconTheme
  };

  const diffs = [];
  let hasChanges = false;

  for (const [key, targetVal] of Object.entries(targetSettings)) {
    const currentVal = currentSettings[key];
    if (currentVal !== targetVal) {
      hasChanges = true;
      diffs.push({
        key,
        current: currentVal !== undefined ? JSON.stringify(currentVal) : '(unset)',
        target: JSON.stringify(targetVal)
      });
    }
  }

  // Clean up any redundant colorCustomizations since they are natively compiled into the theme VSIX
  const colorCustomizations = currentSettings['workbench.colorCustomizations'];
  let cleanColorCustomizations = null;
  if (colorCustomizations && typeof colorCustomizations === 'object') {
    const keysToRemove = ['[TBM Theme]', '[TBM Burgundy]', '[Vira Carbon]'];
    const foundKeys = keysToRemove.filter((k) => k in colorCustomizations);
    if (foundKeys.length > 0) {
      hasChanges = true;
      cleanColorCustomizations = { ...colorCustomizations };
      for (const k of foundKeys) {
        delete cleanColorCustomizations[k];
        diffs.push({
          key: `workbench.colorCustomizations["${k}"]`,
          current: '(redundant overrides)',
          target: '(removed - native in theme VSIX)'
        });
      }
    }
  }

  if (!hasChanges) {
    console.log('✅ Settings are already fully pinned to TBM Theme:');
    for (const [key, targetVal] of Object.entries(targetSettings)) {
      console.log(`  "${key}": "${targetVal}"`);
    }
    console.log('\nAll uniform surfaces and accents are natively baked into the VSIX extension.');
    console.log('No settings.json color overrides required. (100% portable)');
    return;
  }

  console.log('Proposed Settings Changes:');
  console.log('--------------------------------------------------');
  for (const diff of diffs) {
    console.log(`  ${diff.key}:`);
    console.log(`    Current: ${diff.current}`);
    console.log(`    Target:  ${diff.target}`);
  }
  console.log('--------------------------------------------------\n');

  if (!isApply) {
    console.log('[apply-settings] Dry-run complete. No files were modified.');
    console.log('[apply-settings] To apply these settings, run:');
    console.log('  node scripts/apply-settings.mjs --apply\n');
    return;
  }

  // Safety Backup
  const backupPath = `${settingsPath}.${Date.now()}.bak`;
  fs.copyFileSync(settingsPath, backupPath);
  console.log(`[apply-settings] Safety backup created: ${backupPath}`);

  // Apply Changes
  const updated = { ...currentSettings, ...targetSettings };
  if (cleanColorCustomizations !== null) {
    if (Object.keys(cleanColorCustomizations).length === 0) {
      delete updated['workbench.colorCustomizations'];
    } else {
      updated['workbench.colorCustomizations'] = cleanColorCustomizations;
    }
  }

  fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log('[apply-settings] Successfully updated settings.json!');
  console.log('[apply-settings] All theme surfaces and icons are native to the VSIX.');
  console.log('[apply-settings] Please reload Antigravity IDE (Cmd+Shift+P -> "Developer: Reload Window").');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  applySettings();
}
