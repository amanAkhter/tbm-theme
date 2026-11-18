// scripts/build-tbm.mjs
// Compiles TBM Theme, TBM Theme High Contrast, and TBM Burgundy with uniform dark surfaces

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function buildStatusAndChangeColors({
  baseBg,
  untracked,
  added,
  modified,
  stageModified,
  renamed,
  deleted,
  stageDeleted,
  conflicting,
  submodule,
  ignored,
  error,
  errorHover,
  errorBg,
  errorFg,
  warning,
  warningHover,
  warningBg,
  warningFg,
  info,
  infoBg,
  infoFg,
  hint
}) {
  return {
    // Explorer & File/Folder New Change Highlighting (Git Decorations)
    'gitDecoration.untrackedResourceForeground': untracked,
    'gitDecoration.addedResourceForeground': added,
    'gitDecoration.modifiedResourceForeground': modified,
    'gitDecoration.stageModifiedResourceForeground': stageModified,
    'gitDecoration.renamedResourceForeground': renamed,
    'gitDecoration.deletedResourceForeground': deleted,
    'gitDecoration.stageDeletedResourceForeground': stageDeleted,
    'gitDecoration.conflictingResourceForeground': conflicting,
    'gitDecoration.submoduleResourceForeground': submodule,
    'gitDecoration.ignoredResourceForeground': ignored,

    // Modified / Unsaved Editor Tabs
    'tab.activeModifiedBorder': modified,
    'tab.inactiveModifiedBorder': `${modified}80`,
    'tab.unfocusedActiveModifiedBorder': `${modified}b3`,
    'tab.unfocusedInactiveModifiedBorder': `${modified}59`,

    // Editor Gutter, Diff, Overview Ruler & Minimap Change Indicators
    'editorGutter.addedBackground': `${untracked}cc`,
    'editorGutter.modifiedBackground': `${modified}cc`,
    'editorGutter.deletedBackground': `${error}cc`,
    'editorGutter.addedSecondaryBackground': `${untracked}80`,
    'editorGutter.modifiedSecondaryBackground': `${modified}80`,
    'editorGutter.deletedSecondaryBackground': `${error}80`,
    'diffEditor.insertedLineBackground': `${untracked}14`,
    'diffEditor.insertedTextBackground': `${untracked}26`,
    'diffEditor.removedLineBackground': `${error}14`,
    'diffEditor.removedTextBackground': `${error}26`,
    'editorOverviewRuler.addedForeground': `${untracked}b3`,
    'editorOverviewRuler.modifiedForeground': `${modified}b3`,
    'editorOverviewRuler.deletedForeground': `${error}b3`,
    'minimapGutter.addedBackground': `${untracked}cc`,
    'minimapGutter.modifiedBackground': `${modified}cc`,
    'minimapGutter.deletedBackground': `${error}cc`,

    // Chat / Agent Edited File & Diff Indicators
    'chat.editedFileForeground': modified,
    'chat.linesAddedForeground': untracked,
    'chat.linesRemovedForeground': error,

    // Editor Squiggle Diagnostics (Error / Warning / Info / Hint)
    'editorError.foreground': error,
    'editorWarning.foreground': warning,
    'editorInfo.foreground': info,
    'editorHint.foreground': hint,

    // Explorer Folder & File Error / Warning Highlighting
    'list.errorForeground': error,
    'list.warningForeground': warning,
    'list.invalidItemForeground': error,
    'errorForeground': error,

    // Problems Panel & Marker Navigation (F8 Peek)
    'problemsErrorIcon.foreground': error,
    'problemsWarningIcon.foreground': warning,
    'problemsInfoIcon.foreground': info,
    'editorMarkerNavigationError.background': error,
    'editorMarkerNavigationError.headerBackground': `${error}1a`,
    'editorMarkerNavigationWarning.background': warning,
    'editorMarkerNavigationWarning.headerBackground': `${warning}1a`,
    'editorMarkerNavigationInfo.background': info,
    'editorMarkerNavigationInfo.headerBackground': `${info}1a`,

    // Overview Ruler & Minimap Diagnostics
    'editorOverviewRuler.errorForeground': `${error}e6`,
    'editorOverviewRuler.warningForeground': `${warning}e6`,
    'editorOverviewRuler.infoForeground': `${info}cc`,
    'minimap.errorHighlight': error,
    'minimap.warningHighlight': warning,
    'minimap.infoHighlight': info,

    // Activity Bar Badges, Status Bar, Notifications, Validation & Debug Console
    'activityErrorBadge.background': error,
    'activityErrorBadge.foreground': baseBg,
    'activityWarningBadge.background': warning,
    'activityWarningBadge.foreground': baseBg,
    'notificationsErrorIcon.foreground': error,
    'notificationsWarningIcon.foreground': warning,
    'notificationsInfoIcon.foreground': info,
    'inputValidation.errorBorder': error,
    'inputValidation.errorBackground': errorBg,
    'inputValidation.errorForeground': errorFg,
    'inputValidation.warningBorder': warning,
    'inputValidation.warningBackground': warningBg,
    'inputValidation.warningForeground': warningFg,
    'inputValidation.infoBorder': info,
    'inputValidation.infoBackground': infoBg,
    'inputValidation.infoForeground': infoFg,
    'statusBarItem.errorBackground': error,
    'statusBarItem.errorForeground': baseBg,
    'statusBarItem.errorHoverBackground': errorHover,
    'statusBarItem.errorHoverForeground': baseBg,
    'statusBarItem.warningBackground': warning,
    'statusBarItem.warningForeground': baseBg,
    'statusBarItem.warningHoverBackground': warningHover,
    'statusBarItem.warningHoverForeground': baseBg,
    'debugConsole.errorForeground': error,
    'debugConsole.warningForeground': warning,
    'debugConsole.infoForeground': info
  };
}

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
  'textLink.foreground': '#80CBC4',

  // Status Bar Remote Host Indicator Button
  'statusBarItem.remoteBackground': '#80CBC4',
  'statusBarItem.remoteForeground': '#0A0A0A',
  'statusBarItem.remoteHoverBackground': '#66D5CB',
  'statusBarItem.remoteHoverForeground': '#0A0A0A',
  'statusBarItem.offlineBackground': '#56575D',
  'statusBarItem.offlineForeground': '#0A0A0A',
  'statusBarItem.offlineHoverBackground': '#80CBC4',
  'statusBarItem.offlineHoverForeground': '#0A0A0A',

  ...buildStatusAndChangeColors({
    baseBg: '#0A0A0A',
    untracked: '#4ADE80',
    added: '#34D399',
    modified: '#E8C468',
    stageModified: '#F5B041',
    renamed: '#5EEAD4',
    deleted: '#F07178',
    stageDeleted: '#E0525B',
    conflicting: '#D896FF',
    submodule: '#7EB7E8',
    ignored: '#56575D80',
    error: '#FF4D4F',
    errorHover: '#FF6B6D',
    errorBg: '#2A0D10',
    errorFg: '#FFD6D6',
    warning: '#FFA94D',
    warningHover: '#FFBC70',
    warningBg: '#2A1E0A',
    warningFg: '#FFE8C2',
    info: '#58A6FF',
    infoBg: '#0D1C2E',
    infoFg: '#D6EBFF',
    hint: '#80CBC4b3'
  })
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
  'panel.border': '#000000',

  ...buildStatusAndChangeColors({
    baseBg: '#000000',
    untracked: '#5CEB91',
    added: '#45E6AA',
    modified: '#F5D073',
    stageModified: '#FFC05C',
    renamed: '#73F5E0',
    deleted: '#FF7A80',
    stageDeleted: '#F5656E',
    conflicting: '#E2ABFF',
    submodule: '#94C7F2',
    ignored: '#56575D99',
    error: '#FF5C5C',
    errorHover: '#FF7A7A',
    errorBg: '#2B080A',
    errorFg: '#FFE0E0',
    warning: '#FFB85C',
    warningHover: '#FFCA80',
    warningBg: '#2B1D05',
    warningFg: '#FFEFD1',
    info: '#79C0FF',
    infoBg: '#081B33',
    infoFg: '#E0F0FF',
    hint: '#80CBC4cc'
  })
};

// TBM Burgundy Palette (Deep iPhone Pro Dark Titanium Burgundy #100306 Base Surface)
const BURGUNDY_BASE = '#100306';
const BURGUNDY_ELEVATED = '#1C060C';
const BURGUNDY_SELECTION = '#2D0A14';
const BURGUNDY_ACCENT = '#FF7597';
const BURGUNDY_ACCENT_HOVER = '#FF8DA1';
const BURGUNDY_TEXT = '#F5E8EB';
const BURGUNDY_MUTED = '#8A5D66';
const BURGUNDY_SUBTLE = '#4A1E27';
const BURGUNDY_BORDER = '#100306';

// TBM Dark Navy Blue Palette (Deep Dark Midnight Navy #010414 Base Surface)
const NAVY_BASE = '#010414';
const NAVY_ELEVATED = '#050D24';
const NAVY_SELECTION = '#0A1A40';
const NAVY_ACCENT = '#38BDF8';
const NAVY_ACCENT_HOVER = '#67E8F9';
const NAVY_TEXT = '#E2E8F0';
const NAVY_MUTED = '#546A8C';
const NAVY_SUBTLE = '#192C54';
const NAVY_BORDER = '#010414';

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
  'sideBar.foreground': '#C7A2AB',
  'sideBarTitle.foreground': BURGUNDY_TEXT,
  'titleBar.activeForeground': BURGUNDY_TEXT,
  'titleBar.inactiveForeground': BURGUNDY_MUTED,
  'tab.activeForeground': '#FFFFFF',
  'tab.inactiveForeground': BURGUNDY_MUTED,
  'editorLineNumber.foreground': BURGUNDY_SUBTLE,
  'editorLineNumber.activeForeground': '#F7EBEF',
  'descriptionForeground': '#C7A2ABcc',
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

  // Status Bar Remote Host Indicator Button
  'statusBarItem.remoteBackground': BURGUNDY_ACCENT,
  'statusBarItem.remoteForeground': BURGUNDY_BASE,
  'statusBarItem.remoteHoverBackground': BURGUNDY_ACCENT_HOVER,
  'statusBarItem.remoteHoverForeground': BURGUNDY_BASE,
  'statusBarItem.offlineBackground': BURGUNDY_MUTED,
  'statusBarItem.offlineForeground': BURGUNDY_BASE,
  'statusBarItem.offlineHoverBackground': BURGUNDY_ACCENT,
  'statusBarItem.offlineHoverForeground': BURGUNDY_BASE,

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
  'editor.lineHighlightBackground': '#1C060C66',
  'editorCursor.foreground': BURGUNDY_ACCENT,
  'editorCursor.background': BURGUNDY_BASE,
  'editorWhitespace.foreground': '#331018',
  'editorIndentGuide.background': '#200810',
  'editorIndentGuide.activeBackground': '#4A1724',
  'editorRuler.foreground': '#200810',
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
  'terminal.ansiBrightWhite': '#FFFFFF',

  ...buildStatusAndChangeColors({
    baseBg: BURGUNDY_BASE,
    untracked: '#4ADE80',
    added: '#5CE6B0',
    modified: '#F2C97D',
    stageModified: '#FFB86C',
    renamed: '#8CE0FF',
    deleted: '#F87171',
    stageDeleted: '#EF5350',
    conflicting: '#E6A8FF',
    submodule: '#7EB7E8',
    ignored: '#8A5D668C',
    error: '#FF453A',
    errorHover: '#FF6961',
    errorBg: '#2B080D',
    errorFg: '#FFD9D6',
    warning: '#FFA94D',
    warningHover: '#FFBF75',
    warningBg: '#2B180A',
    warningFg: '#FFECD1',
    info: '#7EB7E8',
    infoBg: '#1A1024',
    infoFg: '#DCEEFF',
    hint: '#A8E6CFb3'
  })
};

const UNIFORM_NAVY_OVERRIDES = {
  // Uniform Background Surfaces
  'editor.background': NAVY_BASE,
  'editorGutter.background': NAVY_BASE,
  'statusBar.background': NAVY_BASE,
  'statusBar.noFolderBackground': NAVY_BASE,
  'statusBar.debuggingBackground': NAVY_BASE,
  'activityBar.background': NAVY_BASE,
  'activityBar.activeBackground': NAVY_BASE,
  'activityBarTop.background': NAVY_BASE,
  'tab.activeBackground': NAVY_BASE,
  'tab.inactiveBackground': NAVY_BASE,
  'tab.unfocusedActiveBackground': NAVY_BASE,
  'tab.unfocusedInactiveBackground': NAVY_BASE,
  'breadcrumb.background': NAVY_BASE,
  'breadcrumbPicker.background': NAVY_BASE,
  'banner.background': NAVY_BASE,
  'sideBar.background': NAVY_BASE,
  'sideBarSectionHeader.background': NAVY_BASE,
  'terminal.background': NAVY_BASE,
  'editorGroupHeader.tabsBackground': NAVY_BASE,
  'editorGroupHeader.noTabsBackground': NAVY_BASE,
  'menu.background': NAVY_BASE,
  'titleBar.activeBackground': NAVY_BASE,
  'titleBar.inactiveBackground': NAVY_BASE,
  'minimap.background': NAVY_BASE,
  'panel.background': NAVY_BASE,
  'panelSectionHeader.background': NAVY_BASE,
  'dropdown.background': NAVY_BASE,
  'debugToolBar.background': NAVY_BASE,
  'editorWidget.background': NAVY_BASE,
  'editorHoverWidget.background': NAVY_BASE,
  'editorSuggestWidget.background': NAVY_BASE,
  'notifications.background': NAVY_BASE,
  'quickInput.background': NAVY_BASE,
  'quickInputTitle.background': NAVY_BASE,

  // Seamless Borders
  'editorGroup.border': NAVY_BORDER,
  'editorGroupHeader.tabsBorder': NAVY_BORDER,
  'editorGroupHeader.border': NAVY_BORDER,
  'sideBar.border': NAVY_BORDER,
  'sideBarSectionHeader.border': NAVY_BORDER,
  'sideBarStickyScroll.border': NAVY_BORDER,
  'sideBarActivityBarTop.border': NAVY_BORDER,
  'statusBar.border': NAVY_BORDER,
  'activityBar.border': NAVY_BORDER,
  'titleBar.border': NAVY_BORDER,
  'menu.border': NAVY_BORDER,
  'tab.border': NAVY_BORDER,
  'tab.activeBorder': NAVY_BORDER,
  'tab.unfocusedActiveBorder': NAVY_BORDER,
  'tab.unfocusedActiveBorderTop': NAVY_BORDER,
  'editorOverviewRuler.border': NAVY_BORDER,
  'notebook.cellBorderColor': NAVY_BORDER,
  'editor.lineHighlightBorder': NAVY_BORDER,
  'editorStickyScroll.border': NAVY_BORDER,
  'panel.border': NAVY_BORDER,
  'panelSection.border': NAVY_BORDER,
  'commandCenter.border': NAVY_BORDER,
  'widget.border': NAVY_BORDER,
  'pickerGroup.border': NAVY_BORDER,
  'keybindingLabel.border': NAVY_BORDER,
  'keybindingLabel.bottomBorder': NAVY_BORDER,

  // Text & Foregrounds
  'foreground': NAVY_TEXT,
  'editor.foreground': NAVY_TEXT,
  'sideBar.foreground': '#8AA3C7',
  'sideBarTitle.foreground': NAVY_TEXT,
  'titleBar.activeForeground': NAVY_TEXT,
  'titleBar.inactiveForeground': NAVY_MUTED,
  'tab.activeForeground': '#FFFFFF',
  'tab.inactiveForeground': NAVY_MUTED,
  'editorLineNumber.foreground': NAVY_SUBTLE,
  'editorLineNumber.activeForeground': '#F1F5F9',
  'descriptionForeground': '#8AA3C7cc',
  'disabledForeground': NAVY_MUTED,
  'icon.foreground': '#F1F5F9b3',

  // Accent Highlights (Electric Sky Blue #38BDF8)
  'activityBar.foreground': NAVY_ACCENT,
  'activityBar.activeBorder': NAVY_ACCENT,
  'tab.activeBorderTop': NAVY_ACCENT,
  'terminal.tab.activeBorder': NAVY_ACCENT,
  'panelTitle.activeBorder': NAVY_ACCENT,
  'panelTitle.activeForeground': NAVY_TEXT,
  'panelTitle.inactiveForeground': NAVY_MUTED,
  'badge.background': NAVY_ACCENT,
  'badge.foreground': NAVY_BASE,
  'activityBarBadge.background': NAVY_ACCENT,
  'activityBarBadge.foreground': NAVY_BASE,
  'selection.background': '#38BDF840',
  'progressBar.background': NAVY_ACCENT,
  'textLink.foreground': NAVY_ACCENT,
  'textLink.activeForeground': '#FFFFFF',
  'focusBorder': NAVY_ACCENT,
  'sash.hoverBorder': '#38BDF880',

  // Status Bar Remote Host Indicator Button
  'statusBarItem.remoteBackground': NAVY_ACCENT,
  'statusBarItem.remoteForeground': NAVY_BASE,
  'statusBarItem.remoteHoverBackground': NAVY_ACCENT_HOVER,
  'statusBarItem.remoteHoverForeground': NAVY_BASE,
  'statusBarItem.offlineBackground': NAVY_MUTED,
  'statusBarItem.offlineForeground': NAVY_BASE,
  'statusBarItem.offlineHoverBackground': NAVY_ACCENT,
  'statusBarItem.offlineHoverForeground': NAVY_BASE,

  // Interactive Inputs & Elevated Planes
  'input.background': NAVY_ELEVATED,
  'input.foreground': NAVY_TEXT,
  'input.placeholderForeground': NAVY_MUTED,
  'input.border': '#38BDF833',
  'button.background': NAVY_ACCENT,
  'button.foreground': NAVY_BASE,
  'button.hoverBackground': NAVY_ACCENT_HOVER,
  'button.secondaryBackground': NAVY_ELEVATED,
  'button.secondaryForeground': NAVY_TEXT,

  // Lists & Trees
  'list.hoverBackground': NAVY_ELEVATED,
  'list.hoverForeground': '#FFFFFF',
  'list.activeSelectionBackground': NAVY_SELECTION,
  'list.activeSelectionForeground': NAVY_ACCENT,
  'list.inactiveSelectionBackground': NAVY_ELEVATED,
  'list.inactiveSelectionForeground': NAVY_ACCENT,
  'list.focusBackground': NAVY_SELECTION,
  'list.focusForeground': '#FFFFFF',
  'list.highlightForeground': NAVY_ACCENT,

  // Editor Selections, Cursor & Guides
  'editor.selectionBackground': '#38BDF840',
  'editor.selectionHighlightBackground': '#38BDF826',
  'editor.lineHighlightBackground': '#060E2866',
  'editorCursor.foreground': NAVY_ACCENT,
  'editorCursor.background': NAVY_BASE,
  'editorWhitespace.foreground': '#0C1B3E',
  'editorIndentGuide.background': '#050E24',
  'editorIndentGuide.activeBackground': '#0E2254',
  'editorRuler.foreground': '#050E24',
  'scrollbarSlider.background': '#38BDF826',
  'scrollbarSlider.hoverBackground': '#38BDF840',
  'scrollbarSlider.activeBackground': '#38BDF880',

  // Terminal ANSI Colors
  'terminal.ansiBlack': NAVY_BASE,
  'terminal.ansiRed': '#FF6B8B',
  'terminal.ansiGreen': '#4ADE80',
  'terminal.ansiYellow': '#FBBF24',
  'terminal.ansiBlue': '#60A5FA',
  'terminal.ansiMagenta': '#C084FC',
  'terminal.ansiCyan': '#38BDF8',
  'terminal.ansiWhite': NAVY_TEXT,
  'terminal.ansiBrightBlack': NAVY_MUTED,
  'terminal.ansiBrightRed': '#FDA4AF',
  'terminal.ansiBrightGreen': '#86EFAC',
  'terminal.ansiBrightYellow': '#FDE68A',
  'terminal.ansiBrightBlue': '#93C5FD',
  'terminal.ansiBrightMagenta': '#E9D5FF',
  'terminal.ansiBrightCyan': '#7DD3FC',
  'terminal.ansiBrightWhite': '#FFFFFF',

  ...buildStatusAndChangeColors({
    baseBg: NAVY_BASE,
    untracked: '#4ADE80',
    added: '#34D399',
    modified: '#F5C451',
    stageModified: '#FBBF24',
    renamed: '#67E8F9',
    deleted: '#F87171',
    stageDeleted: '#EF5350',
    conflicting: '#D8B4FE',
    submodule: '#7DD3FC',
    ignored: '#546A8C8C',
    error: '#FF5252',
    errorHover: '#FF7070',
    errorBg: '#220B18',
    errorFg: '#FFD9D9',
    warning: '#FB923C',
    warningHover: '#FDBA74',
    warningBg: '#1E180A',
    warningFg: '#FFEDD5',
    info: '#60A5FA',
    infoBg: '#081B38',
    infoFg: '#DBEAFE',
    hint: '#7DD3FCb3'
  })
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

// Syntax color mapping for Navy aesthetic
function transformTokensForNavy(tokens) {
  const tokenMap = {
    '#D9D9D9': NAVY_TEXT,   // Crisp frosted ice-white (15.45:1 AAA)
    '#a3c679': '#4ADE80',   // Emerald mint strings (12.3:1 AAA)
    '#6ebad7': '#38BDF8',   // Electric sky cyan keywords / tags (9.72:1 AAA)
    '#d6808f': '#FBBF24',   // Amber gold booleans (12.8:1 AAA)
    '#cd775c': '#FB923C',   // Sunset amber numbers (10.9:1 AAA)
    '#6a90d0': '#60A5FA',   // Cobalt blue functions (9.1:1 AAA)
    '#a178c4': '#C084FC',   // Lavender amethyst storage (11.4:1 AAA)
    '#c85e60': '#F472B6',   // Soft rose methods/keys (9.8:1 AAA)
    '#d5b05f': '#FCD34D',   // Golden sand types/classes (13.7:1 AAA)
    '#45454A': '#627A9C',   // Slate steel comments (5.2:1 AA)
    '#7d5e49': '#94A3B8',   // Muted slate
    '#90a9bc': '#7DD3FC',   // Frosted cyan properties (13.1:1 AAA)
    '#D9D9D9e6': `${NAVY_TEXT}e6`
  };

  return tokens.map((token) => {
    const settings = { ...token.settings };
    if (settings.background) {
      settings.background = NAVY_BASE;
    }
    if (settings.foreground && tokenMap[settings.foreground]) {
      settings.foreground = tokenMap[settings.foreground];
    }
    return { ...token, settings };
  });
}

function transformSemanticTokensForNavy(semantic) {
  const tokenMap = {
    '#D9D9D9': NAVY_TEXT,
    '#d5b05f': '#FCD34D',
    '#cd775c': '#FB923C',
    '#6a90d0': '#60A5FA',
    '#90a9bc': '#7DD3FC',
    '#45454A': '#627A9C',
    '#a3c679': '#4ADE80'
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

    // 1. TBM Dark (Default)
    const tbmTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Dark',
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

    // 3. TBM Dark Navy Blue Variant
    const navyMergedColors = {
      ...mergedColors,
      ...UNIFORM_NAVY_OVERRIDES
    };
    const tbmNavyTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Dark Navy Blue',
      type: 'dark',
      semanticHighlighting: true,
      colors: navyMergedColors,
      tokenColors: transformTokensForNavy(rawTheme.tokenColors),
      semanticTokenColors: transformSemanticTokensForNavy(rawTheme.semanticTokenColors)
    };
    fs.writeFileSync(path.join(themesDir, 'tbm-navy.json'), JSON.stringify(tbmNavyTheme, null, 2) + '\n', 'utf8');
    console.log(`[build-tbm] Generated themes/tbm-navy.json (${Object.keys(tbmNavyTheme.colors).length} colors)`);
  }

  if (fs.existsSync(hcSrc)) {
    const rawHc = JSON.parse(fs.readFileSync(hcSrc, 'utf8'));
    const mergedHcColors = {
      ...rawHc.colors,
      ...UNIFORM_HC_OVERRIDES
    };
    for (const k of STALE_KEYS) delete mergedHcColors[k];

    // 3. TBM Dark High Contrast
    const tbmHcTheme = {
      $schema: 'vscode://schemas/color-theme',
      name: 'TBM Dark High Contrast',
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
