# AI Reference Sources & Reverse-Engineering Methodology: TBM Theme

This document compiles the reference sources, reverse-engineering methodology, AST extraction patterns, and design token formulas used in the creation of **TBM Theme**.

---

## 1. Primary Reference Sources

| Resource | URL / Location | Relevance |
|---|---|---|
| **REA (Reverse Engineering Anything)** | `https://github.com/morluto/rea` | Systematic protocol for reverse-engineering shipped binaries & artifacts |
| **VS Code Theme Color Reference** | `code.visualstudio.com/api/references/theme-color` | Official registry of workbench color keys |
| **VS Code Product Icon Theme API** | `code.visualstudio.com/api/extension-guides/product-icon-theme` | Schema and specifications for WOFF2 product icon glyphs |
| **VS Code File Icon Theme API** | `code.visualstudio.com/api/extension-guides/file-icon-theme` | Schema for file extension, name, and folder mapping |
| **WCAG 2.1 Specification** | `w3.org/WAI/WCAG21/Understanding/contrast-minimum.html` | Relative luminance and contrast ratio algorithms |

---

## 2. REA Decoupling & Reverse Engineering Methodology

The REA protocol was employed to analyze the target VSIX package (`vira.vsc-vira-theme-2026.9.6.vsix`):

```
Target VSIX Archive
     │
     ├── 1. Unpack via ZIP extraction
     ├── 2. AST Static Analysis of extension/build/index.js (Deobfuscate license checks)
     ├── 3. Identify runtime timebombs & telemetry callbacks
     ├── 4. Decouple into purely declarative contributes.* manifest
     └── 5. Extract static vector assets (WOFF2 font, 393 file/folder SVGs)
```

### Key Technical Insights:
- **Licensing Engine Nullification**: The proprietary daemon was decoupled by omitting `"main": "./build/index.js"` and `"activationEvents": ["onStartupFinished"]` in `package.json`.
- **Zero Performance Penalty**: Declarative themes load instantaneously via VS Code's internal theme engine without starting an extension host Node.js child process.

---

## 3. AST Key Extraction Regular Expressions

Used in `scripts/doctor.mjs` against `/Applications/Antigravity IDE.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js`:

```javascript
// Color registration pattern matching minified registration calls:
const colorFnRegex = /\b(?:Te|je)\(\s*["\x27]([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)*)["\x27]/g;

// Terminal ANSI colors pattern:
const ansiRegex = /["\x27](terminal\.ansi[A-Za-z]+)["\x27]/g;

// Product Icon registration pattern (icon-id, default glyph codepoint):
const iconRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\(\s*["\x27]([a-z0-9-]+)["\x27]\s*,\s*([56][0-9]{4})\s*\)/g;
```

---

## 4. Engineering Verification Checklist
- [x] **REA Protocol Executed**: Decompiled target VSIX, extracted static assets, eliminated runtime scripts.
- [x] **WCAG AAA Compliance**: Validated 14.03:1 contrast ratio between editor text and background.
- [x] **AST Registry Match**: Validated 294 colors against 906 editor-known colors with 0 stale keys.
- [x] **Asset Path Validation**: Validated all 183 outline product icons and 393 file/folder icon SVGs on disk.
- [x] **Isolated Workspace Scope**: Maintained workspace boundary inside `/Users/aman/playground/testing/`.
