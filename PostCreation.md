# PostCreation.md — TBM Theme for Antigravity IDE

## 1. Project Overview & Publisher Details

**TBM Theme** is an update-resilient, declarative theme extension published by **Aman Akhter** ([https://github.com/amanAkhter](https://github.com/amanAkhter)) engineered specifically for **Antigravity IDE** and VS Code.

- **Publisher Name**: Aman Akhter
- **Publisher GitHub**: [https://github.com/amanAkhter](https://github.com/amanAkhter)
- **Extension Name**: `tbm-theme`
- **Display Name**: `TBM Theme`
- **Color Theme**: `TBM Theme` (`themes/tbm-theme.json`), `TBM Deep Dark Titanium Burgundy` (`themes/tbm-burgundy.json`), & `TBM Theme High Contrast` (`themes/tbm-theme-hc.json`)
- **Product Icon Theme**: `TBM Outline` (`icons/product-icon-theme.json` + `fonts/vira-ui-icons-outline.woff2`) (ID: `tbm-outline`)
- **File Icon Themes**:
  - `TBM Icons` (`icons/file-icon-theme.json` + `icons/files/` & `icons/folders/`) (ID: `tbm-icons`)
  - `TBM Deep Dark Titanium Burgundy File Icons` (`icons/file-icon-theme-burgundy.json` + `icons/burgundy/`) (ID: `tbm-burgundy-icons`)
- **Architecture**: 100% declarative JSON configuration, **0 JavaScript runtime files**, offline, license-free, and update-resilient.

---

## 2. Reverse Engineering & Architecture

1. **Pure Declarative Decoupling**:
   - The upstream commercial Vira theme (`vira.vsc-vira-theme-2026.9.6.vsix`) bundled an obfuscated ~1.4 MB runtime daemon at `extension/build/index.js` activated on `onStartupFinished` (`"pricing": "Trial"`, `"main": "./build/index.js"`).
   - TBM Theme completely removes the `"main"` runtime file and all activation events. Themes and icon packs in VS Code / Antigravity IDE are purely declarative. Stripping the runtime eliminated all license checks, telemetry calls, and potential breakage points while leaving the UI at 100% native performance.

2. **Authentic Glyph & SVG Extraction**:
   - **Product Icon Font**: Mapped `fonts/vira-ui-icons-outline.woff2` (15.65 KB) with 183 outline glyph definitions in `icons/product-icon-theme.json`.
   - **File & Folder Icons**: Mapped all 393 file/folder icon definitions in `icons/file-icon-theme.json`, backed by 271 file SVGs and complete folder SVG sets (including carbon folder variants).

---

## 3. The Uniform Surface & Border Specification

In default themes, contrasting borders and undefined surface backgrounds create visual distraction. In TBM Theme, all UI backgrounds and borders are unified to `#0A0A0A`:

```json
{
  "editor.background": "#0A0A0A",
  "editorGutter.background": "#0A0A0A",
  "statusBar.background": "#0A0A0A",
  "statusBar.noFolderBackground": "#0A0A0A",
  "statusBar.debuggingBackground": "#0A0A0A",
  "activityBar.background": "#0A0A0A",
  "activityBarTop.background": "#0A0A0A",
  "activityBar.activeBackground": "#0A0A0A",
  "activityBar.foreground": "#80CBC4",
  "tab.activeBackground": "#0A0A0A",
  "tab.inactiveBackground": "#0A0A0A",
  "tab.unfocusedActiveBackground": "#0A0A0A",
  "tab.unfocusedInactiveBackground": "#0A0A0A",
  "breadcrumb.background": "#0A0A0A",
  "breadcrumbPicker.background": "#0A0A0A",
  "banner.background": "#0A0A0A",
  "sideBar.background": "#0A0A0A",
  "sideBarSectionHeader.background": "#0A0A0A",
  "terminal.background": "#0A0A0A",
  "editorGroupHeader.tabsBackground": "#0A0A0A",
  "editorGroupHeader.noTabsBackground": "#0A0A0A",
  "menu.background": "#0A0A0A",
  "titleBar.activeBackground": "#0A0A0A",
  "titleBar.inactiveBackground": "#0A0A0A",
  "titleBar.inactiveForeground": "#56575D",
  "minimap.background": "#0A0A0A",
  "panel.background": "#0A0A0A",
  "panelSectionHeader.background": "#0A0A0A",
  "editorGroup.border": "#0A0A0A",
  "editorGroupHeader.tabsBorder": "#0A0A0A",
  "editorGroupHeader.border": "#0A0A0A",
  "sideBar.border": "#0A0A0A",
  "sideBarSectionHeader.border": "#0A0A0A",
  "sideBarStickyScroll.border": "#0A0A0A",
  "sideBarActivityBarTop.border": "#0A0A0A",
  "statusBar.border": "#0A0A0A",
  "activityBar.border": "#0A0A0A",
  "titleBar.border": "#0A0A0A",
  "menu.border": "#0A0A0A",
  "tab.border": "#0A0A0A",
  "tab.activeBorder": "#0A0A0A",
  "editorOverviewRuler.border": "#0A0A0A",
  "notebook.cellBorderColor": "#0A0A0A",
  "editor.lineHighlightBorder": "#0A0A0A",
  "editorStickyScroll.border": "#0A0A0A",
  "tab.activeBorderTop": "#80CBC4",
  "activityBar.activeBorder": "#80CBC4",
  "panel.border": "#0A0A0A",
  "panelSection.border": "#0A0A0A",
  "terminal.tab.activeBorder": "#80CBC4",
  "badge.background": "#80CBC4",
  "badge.foreground": "#0A0A0A"
}
```

---

## 4. Repository Layout

```
/Users/aman/playground/testing/
├── package.json                   # Extension manifest (name: tbm-theme, publisher: amanAkhter)
├── logo.png                       # Extension icon
├── LICENSE                        # MIT License
├── README.md                      # Project documentation
├── CHANGELOG.md                   # Release notes
├── doctor-report.md               # Antigravity IDE health & compatibility report
├── .last-good-version             # Last verified IDE version (1.107.0)
│
├── themes/
│   ├── tbm-theme.json             # 294 colors: uniform #0A0A0A planes, seamless borders, WCAG 14:1 contrast
│   ├── tbm-burgundy.json          # 294 colors: uniform #160509 dark wine base, rose accents, WCAG 16.63:1 contrast
│   └── tbm-theme-hc.json          # High-contrast pitch black (#000000) variant
│
├── fonts/
│   └── vira-ui-icons-outline.woff2# Authentic outline WOFF2 font (15.65 KB)
│
├── icons/
│   ├── product-icon-theme.json    # 183 outline product icon glyph definitions
│   ├── file-icon-theme.json       # 393 file & folder definitions with hidesExplorerArrows: true
│   ├── files/                     # 271 authentic file SVGs
│   └── folders/                   # Authentic filled & outlined folder SVGs
│
├── scripts/
│   ├── build-tbm.mjs              # Compiles TBM Theme & High Contrast theme files
│   ├── validate.mjs               # WCAG contrast, font integrity, and SVG file path validator
│   ├── doctor.mjs                 # AST bundle scanner checking /Applications/Antigravity IDE.app
│   ├── install.mjs                # Automates: build -> validate -> package -> agy-ide install
│   └── apply-settings.mjs         # Safe JSONC settings manager with automatic timestamped backup
│
└── tbm-theme-2026.9.6.vsix        # Packaged standalone VSIX extension ready for installation
```

---

## 5. Instructions to Run and Install in Antigravity IDE

### 5.1 Automated Install via CLI
Run from the workspace directory:
```bash
npm run install
```
This script will:
1. Compile the theme files via `npm run build`.
2. Run `npm run validate` to verify contrast ratios (14.03:1), font paths, and SVG file presence (393/393).
3. Package the extension into `tbm-theme-2026.9.6.vsix`.
4. Run `agy-ide --install-extension tbm-theme-2026.9.6.vsix --force`.

### 5.2 Manual Install via Antigravity IDE GUI
1. Open Antigravity IDE.
2. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Linux/Windows).
3. Search for and select **Extensions: Install from VSIX...**.
4. Select the file: `/Users/aman/playground/testing/tbm-theme-2026.9.6.vsix`.

### 5.3 Pinning the Theme in Settings
To activate the exact theme trio in your Antigravity settings:
```bash
# 1. Preview changes (Dry run):
npm run apply-settings

# 2. Apply to Antigravity settings.json:
node scripts/apply-settings.mjs --apply
```

This ensures your `~/Library/Application Support/Antigravity IDE/User/settings.json` has:
```json
{
  "workbench.colorTheme": "TBM Theme",
  "workbench.productIconTheme": "tbm-outline",
  "workbench.iconTheme": "tbm-icons"
}
```

Then reload Antigravity IDE:
`Cmd+Shift+P` → **Developer: Reload Window**.

### 5.4 Selecting Themes from the Command Palette
Alternatively, you can choose each individually:
- **Color Theme**: `Cmd+Shift+P` → **Preferences: Color Theme** → select **TBM Theme**.
- **Product Icon Theme**: `Cmd+Shift+P` → **Preferences: Product Icon Theme** → select **TBM Outline**.
- **File Icon Theme**: `Cmd+Shift+P` → **Preferences: File Icon Theme** → select **TBM Icons**.

---

## 6. Update Resilience: How IDE Updates Won't Break the Theme

1. **Zero JavaScript Execution**:
   Because the extension has **0 JavaScript runtime files**, it cannot crash, throw unhandled exceptions, or be broken by changes in the VS Code / Antigravity extension host API.
2. **Built-in Bundle Scanner (`npm run doctor`)**:
   `scripts/doctor.mjs` directly parses `/Applications/Antigravity IDE.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js`. It extracts all 906 workbench colors and 653 product icon IDs and verifies that TBM Theme has **0 stale keys**.
3. **Local Bundled Assets**:
   All font glyphs and SVGs are bundled locally inside the VSIX without remote CDN dependencies.
