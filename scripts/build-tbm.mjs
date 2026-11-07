// scripts/build-tbm.mjs
// Compiles TBM Theme, TBM Theme High Contrast, and TBM Burgundy with uniform dark surfaces

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

// TBM Burgundy Palette (Deep iPhone Pro Dark Titanium Burgundy #160509 Base Surface)
const BURGUNDY_BASE = '#160509';
const BURGUNDY_ELEVATED = '#250B12';
const BURGUNDY_SELECTION = '#3B121E';
const BURGUNDY_ACCENT = '#FF7597';
const BURGUNDY_ACCENT_HOVER = '#FF8DA1';
const BURGUNDY_TEXT = '#F5E8EB';
const BURGUNDY_MUTED = '#9E6E78';
const BURGUNDY_SUBTLE = '#5E2B36';
const BURGUNDY_BORDER = '#160509';

const UNIFORM_BURGUNDY_OVERRIDES = {
  // Uniform Background Surfaces
  'editor.background': BURGUNDY_BASE,
  'editorGutter.background': BURGUNDY_BASE,
  'statusBar.background': BURGUNDY_BASE,
  'statusBar.noFolderBackground': BURGUNDY_BASE,
  'statusBar.debuggingBackground': BURGUNDY_BASE,
  'activityBar.background': BURGUNDY_BASE,
  'activityBar.activeBackground': BURGUNDY_BASE,
  'activityBarTop.background': BURGUNDY_BASE,
  'tab.activeBackground': BURGUNDY_BASE,
  'tab.inactiveBackground': BURGUNDY_BASE,
  'tab.unfocusedActiveBackground': BURGUNDY_BASE,
  'tab.unfocusedInactiveBackground': BURGUNDY_BASE,
  'breadcrumb.background': BURGUNDY_BASE,
  'breadcrumbPicker.background': BURGUNDY_BASE,
  'banner.background': BURGUNDY_BASE,
  'sideBar.background': BURGUNDY_BASE,
  'sideBarSectionHeader.background': BURGUNDY_BASE,
  'terminal.background': BURGUNDY_BASE,
  'editorGroupHeader.tabsBackground': BURGUNDY_BASE,
  'editorGroupHeader.noTabsBackground': BURGUNDY_BASE,
  'menu.background': BURGUNDY_BASE,
  'titleBar.activeBackground': BURGUNDY_BASE,
  'titleBar.inactiveBackground': BURGUNDY_BASE,
  'minimap.background': BURGUNDY_BASE,
  'panel.background': BURGUNDY_BASE,
  'panelSectionHeader.background': BURGUNDY_BASE,
  'dropdown.background': BURGUNDY_BASE,
  'debugToolBar.background': BURGUNDY_BASE,
  'editorWidget.background': BURGUNDY_BASE,
  'editorHoverWidget.background': BURGUNDY_BASE,
  'editorSuggestWidget.background': BURGUNDY_BASE,
  'notifications.background': BURGUNDY_BASE,
  'quickInput.background': BURGUNDY_BASE,
  'quickInputTitle.background': BURGUNDY_BASE,

  // Seamless Borders
  'editorGroup.border': BURGUNDY_BORDER,
  'editorGroupHeader.tabsBorder': BURGUNDY_BORDER,
  'editorGroupHeader.border': BURGUNDY_BORDER,
  'sideBar.border': BURGUNDY_BORDER,
  'sideBarSectionHeader.border': BURGUNDY_BORDER,
  'sideBarStickyScroll.border': BURGUNDY_BORDER,
  'sideBarActivityBarTop.border': BURGUNDY_BORDER,
  'statusBar.border': BURGUNDY_BORDER,
  'activityBar.border': BURGUNDY_BORDER,
  'titleBar.border': BURGUNDY_BORDER,
  'menu.border': BURGUNDY_BORDER,
  'tab.border': BURGUNDY_BORDER,
  'tab.activeBorder': BURGUNDY_BORDER,
  'tab.unfocusedActiveBorder': BURGUNDY_BORDER,
  'tab.unfocusedActiveBorderTop': BURGUNDY_BORDER,
  'editorOverviewRuler.border': BURGUNDY_BORDER,
  'notebook.cellBorderColor': BURGUNDY_BORDER,
  'editor.lineHighlightBorder': BURGUNDY_BORDER,
  'editorStickyScroll.border': BURGUNDY_BORDER,
  'panel.border': BURGUNDY_BORDER,
  'panelSection.border': BURGUNDY_BORDER,
  'commandCenter.border': BURGUNDY_BORDER,
  'widget.border': BURGUNDY_BORDER,
  'pickerGroup.border': BURGUNDY_BORDER,
  'keybindingLabel.border': BURGUNDY_BORDER,
  'keybindingLabel.bottomBorder': BURGUNDY_BORDER,

  // Text & Foregrounds
  'foreground': BURGUNDY_TEXT,
  'editor.foreground': BURGUNDY_TEXT,
  'sideBar.foreground': '#D6B4BC',
  'sideBarTitle.foreground': BURGUNDY_TEXT,
  'titleBar.activeForeground': BURGUNDY_TEXT,
  'titleBar.inactiveForeground': BURGUNDY_MUTED,
  'tab.activeForeground': '#FFFFFF',
  'tab.inactiveForeground': BURGUNDY_MUTED,
  'editorLineNumber.foreground': BURGUNDY_SUBTLE,
  'editorLineNumber.activeForeground': '#F7EBEF',
  'descriptionForeground': '#D6B4BCcc',
  'disabledForeground': BURGUNDY_MUTED,
  'icon.foreground': '#F7EBEFb3',

  // Accent Highlights (Electric Rose / Burgundy Accent #FF7597)
  'activityBar.foreground': BURGUNDY_ACCENT,
  'activityBar.activeBorder': BURGUNDY_ACCENT,
  'tab.activeBorderTop': BURGUNDY_ACCENT,
  'terminal.tab.activeBorder': BURGUNDY_ACCENT,
  'panelTitle.activeBorder': BURGUNDY_ACCENT,
  'panelTitle.activeForeground': BURGUNDY_TEXT,
  'panelTitle.inactiveForeground': BURGUNDY_MUTED,
  'badge.background': BURGUNDY_ACCENT,
  'badge.foreground': BURGUNDY_BASE,
  'activityBarBadge.background': BURGUNDY_ACCENT,
  'activityBarBadge.foreground': BURGUNDY_BASE,
  'selection.background': '#FF759740',
  'progressBar.background': BURGUNDY_ACCENT,
  'textLink.foreground': BURGUNDY_ACCENT,
  'textLink.activeForeground': '#FFFFFF',
  'focusBorder': BURGUNDY_ACCENT,
  'sash.hoverBorder': '#FF759780',

  // Interactive Inputs & Elevated Planes
  'input.background': BURGUNDY_ELEVATED,
  'input.foreground': BURGUNDY_TEXT,
  'input.placeholderForeground': BURGUNDY_MUTED,
  'input.border': '#FF759733',
  'button.background': BURGUNDY_ACCENT,
  'button.foreground': BURGUNDY_BASE,
  'button.hoverBackground': BURGUNDY_ACCENT_HOVER,
  'button.secondaryBackground': BURGUNDY_ELEVATED,
  'button.secondaryForeground': BURGUNDY_TEXT,

  // Lists & Trees
  'list.hoverBackground': BURGUNDY_ELEVATED,
  'list.hoverForeground': '#FFFFFF',
  'list.activeSelectionBackground': BURGUNDY_SELECTION,
  'list.activeSelectionForeground': BURGUNDY_ACCENT,
  'list.inactiveSelectionBackground': BURGUNDY_ELEVATED,
  'list.inactiveSelectionForeground': BURGUNDY_ACCENT,
  'list.focusBackground': BURGUNDY_SELECTION,
  'list.focusForeground': '#FFFFFF',
  'list.highlightForeground': BURGUNDY_ACCENT,

  // Editor Selections, Cursor & Guides
  'editor.selectionBackground': '#FF759740',
  'editor.selectionHighlightBackground': '#FF759726',
  'editor.lineHighlightBackground': '#250B1266',
  'editorCursor.foreground': BURGUNDY_ACCENT,
  'editorCursor.background': BURGUNDY_BASE,
  'editorWhitespace.foreground': '#421622',
  'editorIndentGuide.background': '#2E0E17',
  'editorIndentGuide.activeBackground': '#5E202E',
  'editorRuler.foreground': '#2E0E17',
  'scrollbarSlider.background': '#FF759726',
  'scrollbarSlider.hoverBackground': '#FF759740',
  'scrollbarSlider.activeBackground': '#FF759780',

  // Terminal ANSI Colors
  'terminal.ansiBlack': BURGUNDY_BASE,
  'terminal.ansiRed': '#FF6B8B',
  'terminal.ansiGreen': '#A8E6CF',
  'terminal.ansiYellow': '#FFB86C',
  'terminal.ansiBlue': '#7EB7E8',
  'terminal.ansiMagenta': '#E6A8FF',
  'terminal.ansiCyan': '#A5DEFF',
  'terminal.ansiWhite': BURGUNDY_TEXT,
  'terminal.ansiBrightBlack': BURGUNDY_MUTED,
  'terminal.ansiBrightRed': '#FF8DA1',
  'terminal.ansiBrightGreen': '#BFF0DE',
  'terminal.ansiBrightYellow': '#FFCE91',
  'terminal.ansiBrightBlue': '#A8D4F7',
  'terminal.ansiBrightMagenta': '#EDBFFF',
  'terminal.ansiBrightCyan': '#C4E9FF',
  'terminal.ansiBrightWhite': '#FFFFFF'
};

const STALE_KEYS = new Set([
  'extensionButton.border',
  'surface.border',
  'agentsPanel.border',
  'modernActivityBar.activeForeground',
  'modernEditorTab.activeForeground',
  'modernTab.activeForeground'
]);

// Syntax color mapping for Burgundy aesthetic
function transformTokensForBurgundy(tokens) {
  const tokenMap = {
    '#D9D9D9': BURGUNDY_TEXT, // Crisp warm rose-cream (16.63:1 AAA)
    '#a3c679': '#A8E6CF',     // Sage mint strings (14.05:1 AAA)
    '#6ebad7': '#FF7597',     // Electric rose keywords / tags (7.78:1 AAA)
    '#d6808f': '#FFB86C',     // Warm amber booleans (11.63:1 AAA)
    '#cd775c': '#FFB86C',     // Warm amber numbers (11.63:1 AAA)
    '#6a90d0': '#7EB7E8',     // Cornflower periwinkle functions (9.27:1 AAA)
    '#a178c4': '#E6A8FF',     // Lavender storage (11.50:1 AAA)
    '#c85e60': '#FF7597',     // Rose methods/keys (7.78:1 AAA)
    '#d5b05f': '#E5C07B',     // Golden champagne types/classes (11.47:1 AAA)
    '#45454A': '#A87682',     // Dusty mauve comments (5.26:1 AA)
    '#7d5e49': '#C4929E',     // Muted rose
    '#90a9bc': '#9ECBFF',     // Soft ice blue properties (11.74:1 AAA)
    '#D9D9D9e6': `${BURGUNDY_TEXT}e6`
  };

  return tokens.map((token) => {
    const settings = { ...token.settings };
    if (settings.background) {
      settings.background = BURGUNDY_BASE;
    }
    if (settings.foreground && tokenMap[settings.foreground]) {
      settings.foreground = tokenMap[settings.foreground];
    }
    return { ...token, settings };
  });
}

function transformSemanticTokensForBurgundy(semantic) {
  const tokenMap = {
    '#D9D9D9': BURGUNDY_TEXT,
    '#d5b05f': '#E5C07B',
    '#cd775c': '#FFB86C',
    '#6a90d0': '#7EB7E8',
    '#90a9bc': '#9ECBFF',
    '#45454A': '#A87682',
    '#a3c679': '#A8E6CF'
  };

  const result = {};
  for (const [k, v] of Object.entries(semantic)) {
    result[k] = tokenMap[v] || v;
  }
  return result;
}

export function buildTbmThemes() {
  const themesDir = path.join(rootDir, 'themes');
  fs.mkdirSync(themesDir, { recursive: true });

  const themeSrc = path.join(themesDir, 'tbm-theme.json');
  const hcSrc = path.join(themesDir, 'tbm-theme-hc.json');

  if (fs.existsSync(themeSrc)) {
    const rawTheme = JSON.parse(fs.readFileSync(themeSrc, 'utf8'));
    const mergedColors = {
      ...rawTheme.colors,
      ...UNIFORM_CARBON_OVERRIDES
    };
    for (const k of STALE_KEYS) delete mergedColors[k];

    // 1. TBM Theme (Default)
    const tbmTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Theme',
      type: 'dark',
      semanticHighlighting: true,
      colors: mergedColors,
      tokenColors: rawTheme.tokenColors,
      semanticTokenColors: rawTheme.semanticTokenColors
    };
    fs.writeFileSync(path.join(themesDir, 'tbm-theme.json'), JSON.stringify(tbmTheme, null, 2) + '\n', 'utf8');
    console.log(`[build-tbm] Generated themes/tbm-theme.json (${Object.keys(tbmTheme.colors).length} colors)`);

    // 2. TBM Burgundy Variant
    const burgundyMergedColors = {
      ...mergedColors,
      ...UNIFORM_BURGUNDY_OVERRIDES
    };
    const tbmBurgundyTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Deep Dark Titanium Burgundy',
      type: 'dark',
      semanticHighlighting: true,
      colors: burgundyMergedColors,
      tokenColors: transformTokensForBurgundy(rawTheme.tokenColors),
      semanticTokenColors: transformSemanticTokensForBurgundy(rawTheme.semanticTokenColors)
    };
    fs.writeFileSync(path.join(themesDir, 'tbm-burgundy.json'), JSON.stringify(tbmBurgundyTheme, null, 2) + '\n', 'utf8');
    console.log(`[build-tbm] Generated themes/tbm-burgundy.json (${Object.keys(tbmBurgundyTheme.colors).length} colors)`);
  }

  if (fs.existsSync(hcSrc)) {
    const rawHc = JSON.parse(fs.readFileSync(hcSrc, 'utf8'));
    const mergedHcColors = {
      ...rawHc.colors,
      ...UNIFORM_HC_OVERRIDES
    };
    for (const k of STALE_KEYS) delete mergedHcColors[k];

    // 3. TBM Theme High Contrast
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
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTbmThemes();
}
