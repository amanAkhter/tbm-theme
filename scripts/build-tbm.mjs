// scripts/build-tbm.mjs
// Compiles TBM Theme and High Contrast theme files with uniform dark surfaces

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const UNIFORM_CARBON_OVERRIDES = {
  // Uniform Background Surfaces
  'editor.background': '#0A0A0A',
  'editorGutter.background': '#0A0A0A',
  'statusBar.background': '#0A0A0A',
  'statusBar.noFolderBackground': '#0A0A0A',
  'statusBar.debuggingBackground': '#0A0A0A',
  'activityBar.background': '#0A0A0A',
  'activityBar.activeBackground': '#0A0A0A',
  'activityBarTop.background': '#0A0A0A',
  'tab.activeBackground': '#0A0A0A',
  'tab.inactiveBackground': '#0A0A0A',
  'tab.unfocusedActiveBackground': '#0A0A0A',
  'tab.unfocusedInactiveBackground': '#0A0A0A',
  'breadcrumb.background': '#0A0A0A',
  'breadcrumbPicker.background': '#0A0A0A',
  'banner.background': '#0A0A0A',
  'sideBar.background': '#0A0A0A',
  'sideBarSectionHeader.background': '#0A0A0A',
  'terminal.background': '#0A0A0A',
  'editorGroupHeader.tabsBackground': '#0A0A0A',
  'editorGroupHeader.noTabsBackground': '#0A0A0A',
  'menu.background': '#0A0A0A',
  'titleBar.activeBackground': '#0A0A0A',
  'titleBar.inactiveBackground': '#0A0A0A',
  'minimap.background': '#0A0A0A',
  'panel.background': '#0A0A0A',
  'panelSectionHeader.background': '#0A0A0A',
  'dropdown.background': '#0A0A0A',
  'debugToolBar.background': '#0A0A0A',
  'editorWidget.background': '#0A0A0A',
  'editorHoverWidget.background': '#0A0A0A',
  'editorSuggestWidget.background': '#0A0A0A',
  'notifications.background': '#0A0A0A',
  'quickInput.background': '#0A0A0A',
  'quickInputTitle.background': '#0A0A0A',

  // Seamless Borders (unified with background)
  'editorGroup.border': '#0A0A0A',
  'editorGroupHeader.tabsBorder': '#0A0A0A',
  'editorGroupHeader.border': '#0A0A0A',
  'sideBar.border': '#0A0A0A',
  'sideBarSectionHeader.border': '#0A0A0A',
  'sideBarStickyScroll.border': '#0A0A0A',
  'sideBarActivityBarTop.border': '#0A0A0A',
  'statusBar.border': '#0A0A0A',
  'activityBar.border': '#0A0A0A',
  'titleBar.border': '#0A0A0A',
  'menu.border': '#0A0A0A',
  'tab.border': '#0A0A0A',
  'tab.activeBorder': '#0A0A0A',
  'tab.unfocusedActiveBorder': '#0A0A0A',
  'tab.unfocusedActiveBorderTop': '#0A0A0A',
  'editorOverviewRuler.border': '#0A0A0A',
  'notebook.cellBorderColor': '#0A0A0A',
  'editor.lineHighlightBorder': '#0A0A0A',
  'editorStickyScroll.border': '#0A0A0A',
  'panel.border': '#0A0A0A',
  'panelSection.border': '#0A0A0A',
  'commandCenter.border': '#0A0A0A',
  'widget.border': '#0A0A0A',
  'pickerGroup.border': '#0A0A0A',
  'keybindingLabel.border': '#0A0A0A',
  'keybindingLabel.bottomBorder': '#0A0A0A',

  // Accent Highlights & Text
  'titleBar.inactiveForeground': '#56575D',
  'activityBar.foreground': '#80CBC4',
  'activityBar.activeBorder': '#80CBC4',
  'tab.activeBorderTop': '#80CBC4',
  'terminal.tab.activeBorder': '#80CBC4',
  'panelTitle.activeBorder': '#80CBC4',
  'badge.background': '#80CBC4',
  'badge.foreground': '#0A0A0A',
  'activityBarBadge.background': '#80CBC4',
  'activityBarBadge.foreground': '#000000',
  'selection.background': '#80CBC4',
  'progressBar.background': '#80CBC4',
  'textLink.foreground': '#80CBC4'
};

const UNIFORM_HC_OVERRIDES = {
  ...UNIFORM_CARBON_OVERRIDES,
  'editor.background': '#000000',
  'editorGutter.background': '#000000',
  'statusBar.background': '#000000',
  'statusBar.noFolderBackground': '#000000',
  'statusBar.debuggingBackground': '#000000',
  'activityBar.background': '#000000',
  'activityBar.activeBackground': '#000000',
  'activityBarTop.background': '#000000',
  'tab.activeBackground': '#000000',
  'tab.inactiveBackground': '#000000',
  'breadcrumb.background': '#000000',
  'banner.background': '#000000',
  'sideBar.background': '#000000',
  'terminal.background': '#000000',
  'editorGroupHeader.tabsBackground': '#000000',
  'menu.background': '#000000',
  'titleBar.activeBackground': '#000000',
  'titleBar.inactiveBackground': '#000000',
  'minimap.background': '#000000',
  'panel.background': '#000000',
  'editorGroup.border': '#000000',
  'sideBar.border': '#000000',
  'statusBar.border': '#000000',
  'activityBar.border': '#000000',
  'titleBar.border': '#000000',
  'tab.border': '#000000',
  'tab.activeBorder': '#000000',
  'panel.border': '#000000'
};

const STALE_KEYS = new Set([
  'extensionButton.border',
  'surface.border',
  'agentsPanel.border',
  'modernActivityBar.activeForeground',
  'modernEditorTab.activeForeground',
  'modernTab.activeForeground'
]);

export function buildTbmThemes() {
  const themesDir = path.join(rootDir, 'themes');
  fs.mkdirSync(themesDir, { recursive: true });

  const carbonSrc = path.join(themesDir, 'vira-carbon.json');
  const hcSrc = path.join(themesDir, 'vira-carbon-hc.json');

  if (fs.existsSync(carbonSrc)) {
    const rawCarbon = JSON.parse(fs.readFileSync(carbonSrc, 'utf8'));
    const mergedColors = {
      ...rawCarbon.colors,
      ...UNIFORM_CARBON_OVERRIDES
    };
    for (const k of STALE_KEYS) delete mergedColors[k];

    const tbmTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Theme',
      type: 'dark',
      semanticHighlighting: true,
      colors: mergedColors,
      tokenColors: rawCarbon.tokenColors,
      semanticTokenColors: rawCarbon.semanticTokenColors
    };
    fs.writeFileSync(path.join(themesDir, 'tbm-theme.json'), JSON.stringify(tbmTheme, null, 2) + '\n', 'utf8');
    console.log(`[build-tbm] Generated themes/tbm-theme.json (${Object.keys(tbmTheme.colors).length} colors)`);

    // Keep vira-carbon.json in sync
    const viraTheme = { ...tbmTheme, name: 'Vira Carbon' };
    fs.writeFileSync(path.join(themesDir, 'vira-carbon.json'), JSON.stringify(viraTheme, null, 2) + '\n', 'utf8');
  }

  if (fs.existsSync(hcSrc)) {
    const rawHc = JSON.parse(fs.readFileSync(hcSrc, 'utf8'));
    const mergedHcColors = {
      ...rawHc.colors,
      ...UNIFORM_HC_OVERRIDES
    };
    for (const k of STALE_KEYS) delete mergedHcColors[k];

    const tbmHcTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Theme High Contrast',
      type: 'hcBlack',
      semanticHighlighting: true,
      colors: mergedHcColors,
      tokenColors: rawHc.tokenColors,
      semanticTokenColors: rawHc.semanticTokenColors
    };
    fs.writeFileSync(path.join(themesDir, 'tbm-theme-hc.json'), JSON.stringify(tbmHcTheme, null, 2) + '\n', 'utf8');
    console.log(`[build-tbm] Generated themes/tbm-theme-hc.json (${Object.keys(tbmHcTheme.colors).length} colors)`);

    // Keep vira-carbon-hc.json in sync
    const viraHcTheme = { ...tbmHcTheme, name: 'Vira Carbon High Contrast' };
    fs.writeFileSync(path.join(themesDir, 'vira-carbon-hc.json'), JSON.stringify(viraHcTheme, null, 2) + '\n', 'utf8');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTbmThemes();
}

