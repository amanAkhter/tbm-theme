// scripts/apply-settings.mjs
// Safely previews or pins Vira Carbon theme & icons in Antigravity settings.json

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
    'workbench.iconTheme': 'tbm-icons'
  };

  const uniformCustomization = {
    'editor.background': '#0A0A0A',
    'editorGutter.background': '#0A0A0A',
    'statusBar.background': '#0A0A0A',
    'activityBar.background': '#0A0A0A',
    'tab.activeBackground': '#0A0A0A',
    'breadcrumb.background': '#0A0A0A',
    'banner.background': '#0A0A0A',
    'sideBar.background': '#0A0A0A',
    'tab.inactiveBackground': '#0A0A0A',
    'terminal.background': '#0A0A0A',
    'editorGroupHeader.tabsBackground': '#0A0A0A',
    'activityBar.activeBackground': '#0A0A0A',
    'activityBar.foreground': '#80CBC4',
    'menu.background': '#0A0A0A',
    'titleBar.activeBackground': '#0A0A0A',
    'titleBar.inactiveForeground': '#56575D',
    'minimap.background': '#0A0A0A',
    'editorGroup.border': '#0A0A0A',
    'editorGroupHeader.tabsBorder': '#0A0A0A',
    'sideBar.border': '#0A0A0A',
    'statusBar.border': '#0A0A0A',
    'activityBar.border': '#0A0A0A',
    'titleBar.border': '#0A0A0A',
    'menu.border': '#0A0A0A',
    'tab.border': '#0A0A0A',
    'tab.activeBorder': '#0A0A0A',
    'editorOverviewRuler.border': '#0A0A0A',
    'notebook.cellBorderColor': '#0A0A0A',
    'editor.lineHighlightBorder': '#0A0A0A',
    'editorStickyScroll.border': '#0A0A0A',
    'tab.activeBorderTop': '#80CBC4',
    'activityBar.activeBorder': '#80CBC4',
    'panel.border': '#0A0A0A',
    'panel.background': '#0A0A0A',
    'terminal.tab.activeBorder': '#80CBC4',
    'badge.background': '#80CBC4',
    'badge.foreground': '#0A0A0A'
  };

  const burgundyCustomization = {
    'editor.background': '#27060f',
    'editorGutter.background': '#27060f',
    'statusBar.background': '#27060f',
    'activityBar.background': '#27060f',
    'tab.activeBackground': '#27060f',
    'breadcrumb.background': '#27060f',
    'banner.background': '#27060f',
    'sideBar.background': '#27060f',
    'tab.inactiveBackground': '#27060f',
    'terminal.background': '#27060f',
    'editorGroupHeader.tabsBackground': '#27060f',
    'activityBar.activeBackground': '#27060f',
    'activityBar.foreground': '#FF7597',
    'menu.background': '#27060f',
    'titleBar.activeBackground': '#27060f',
    'titleBar.inactiveForeground': '#8A606B',
    'minimap.background': '#27060f',
    'editorGroup.border': '#27060f',
    'editorGroupHeader.tabsBorder': '#27060f',
    'sideBar.border': '#27060f',
    'statusBar.border': '#27060f',
    'activityBar.border': '#27060f',
    'titleBar.border': '#27060f',
    'menu.border': '#27060f',
    'tab.border': '#27060f',
    'tab.activeBorder': '#27060f',
    'editorOverviewRuler.border': '#27060f',
    'notebook.cellBorderColor': '#27060f',
    'editor.lineHighlightBorder': '#27060f',
    'editorStickyScroll.border': '#27060f',
    'tab.activeBorderTop': '#FF7597',
    'activityBar.activeBorder': '#FF7597',
    'panel.border': '#27060f',
    'panel.background': '#27060f',
    'terminal.tab.activeBorder': '#FF7597',
    'badge.background': '#FF7597',
    'badge.foreground': '#27060f'
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

  // Check colorCustomizations
  const currentColorCustomizations = currentSettings['workbench.colorCustomizations'] || {};
  const currentTbmCustomization = currentColorCustomizations['[TBM Theme]'];
  const customizationsDiffer = JSON.stringify(currentTbmCustomization) !== JSON.stringify(uniformCustomization);
  if (customizationsDiffer) {
    hasChanges = true;
    diffs.push({
      key: 'workbench.colorCustomizations["[TBM Theme]"]',
      current: currentTbmCustomization ? '(customized)' : '(unset)',
      target: '(uniform dark surface rules)'
    });
  }

  if (!hasChanges) {
    console.log('✅ Settings are already fully pinned to TBM Theme:');
    for (const [key, targetVal] of Object.entries(targetSettings)) {
      console.log(`  "${key}": "${targetVal}"`);
    }
    console.log('\nNo changes required. (Idempotent)');
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
  updated['workbench.colorCustomizations'] = {
    ...(currentSettings['workbench.colorCustomizations'] || {}),
    '[TBM Theme]': uniformCustomization,
    '[TBM Burgundy]': burgundyCustomization,
    '[Vira Carbon]': uniformCustomization
  };

  fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log('[apply-settings] Successfully updated settings.json!');
  console.log('[apply-settings] Please reload Antigravity IDE (Cmd+Shift+P -> "Developer: Reload Window").');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  applySettings();
}
