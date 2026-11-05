# Engineering Master Plan: TBM Theme for Antigravity IDE

## 1. Executive Summary & Objective
Ship a production-grade, update-resilient theme extension for **Antigravity IDE** and **VS Code** consisting of:
- **TBM Theme** (and TBM Theme High Contrast): A uniform `#0A0A0A` dark theme with seamless borders and high-legibility `#80CBC4` teal accents.
- **TBM Outline**: An ultra-clean outline product icon theme powered by an authentic WOFF2 font (`183` glyph mappings).
- **TBM Icons**: A calm, high-performance file icon theme covering `393` file and folder definitions.
- **Update Resilience Harness**: AST diagnostic engine (`doctor.mjs`) scanning `/Applications/Antigravity IDE.app`'s workbench bundle to safeguard against regressions on host updates.

---

## 2. Engineering Architecture & Decoupling Strategy

### 2.1 The REA (Reverse Engineering Anything) Decoupling
| Vector | Upstream Implementation | TBM Theme Implementation |
|---|---|---|
| **Runtime Execution** | Obfuscated 1.4 MB Node.js bundle (`build/index.js`) | Pure declarative manifest (`package.json`), **0 JS files** |
| **Activation Lifecycle** | `onStartupFinished` background daemon | Passive engine loading via `contributes.*` |
| **Licensing / Telemetry** | Trial timer, remote licensing ping, fingerprinting | **None**. 100% offline and autonomous |
| **Surface Styling** | Fragmented default fallbacks (`terminal`, `minimap`, `gutter` unset) | 100% unified `#0A0A0A` surface planes & seamless borders |
| **Product Icons** | Bundled WOFF2 font with outline glyphs | Fully recovered `fonts/vira-ui-icons-outline.woff2` (15.65 KB) |
| **File Icons** | 271 file SVGs, carbon folder variants | Comprehensive 393-definition catalog with explorer arrow suppression |

### 2.2 Update Resilience Mechanics
```
Antigravity IDE Update (e.g. 1.107.0 -> 1.108.0)
         │
         ▼
[scripts/doctor.mjs] Scans /Applications/Antigravity IDE.app
         │
         ├── Extracted known colors (Te, je, ansi regex)
         ├── Extracted known product icon IDs
         ▼
Diff against themes/tbm-theme.json
         ├── Stale Keys (Deprecated in editor) ──> Flag for pruning
         └── Priority New Keys (New surfaces)  ──> Recommended for styling
         ▼
Output: doctor-report.md + .last-good-version update
```

---

## 3. Production Folder Layout

```
/Users/aman/playground/testing/
├── package.json                   # Declarative manifest (name: tbm-theme, publisher: amanAkhter)
├── logo.png                       # Extension icon
├── LICENSE                        # MIT License
├── README.md                      # Production documentation
├── CHANGELOG.md                   # KeepAChangelog release ledger
├── doctor-report.md               # Generated Antigravity IDE health audit
├── .last-good-version             # Version tracking marker (1.107.0)
├── .gitignore                     # Git ignore rules
├── .vscodeignore                  # VSIX packaging filters
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI build & validation pipeline
│
├── src/
│   ├── palette.json               # Canonical design token palette
│   ├── workbench-map.json         # Workbench UI semantic mapping
│   ├── tokens-map.json            # Syntax & semantic token highlighting maps
│   └── known-product-icon-ids.json# 653 product icon IDs extracted from editor bundle
│
├── themes/
│   ├── tbm-theme.json             # 294 compiled colors: uniform #0A0A0A surfaces & borders
│   ├── tbm-theme-hc.json          # High-contrast pitch black variant (#000000)
│   ├── vira-carbon.json           # Backward-compatible alias
│   └── vira-carbon-hc.json        # Backward-compatible alias
│
├── fonts/
│   └── vira-ui-icons-outline.woff2# Authentic outline WOFF2 font (15.65 KB)
│
├── icons/
│   ├── product-icon-theme.json    # 183 outline product icon glyph definitions
│   ├── file-icon-theme.json       # 393 file/folder definitions (hidesExplorerArrows: true)
│   ├── files/                     # 271 authentic file SVGs
│   └── folders/                   # Authentic folder SVGs (filled, outlined, carbon variants)
│
├── scripts/
│   ├── build-tbm.mjs              # Deterministic theme compiler
│   ├── validate.mjs               # WCAG contrast, font integrity, and SVG path test suite
│   ├── doctor.mjs                 # AST bundle parser against Antigravity IDE
│   ├── install.mjs                # Build -> validate -> package -> agy-ide install pipeline
│   └── apply-settings.mjs         # Safe JSONC settings manager with automatic timestamped backup
│
├── samples/                       # Multi-language syntax verification suite
│   ├── sample.ts, sample.py, sample.rs, sample.go, sample.json,
│   └── sample.md, sample.html, sample.css, sample.sh, sample.yaml
│
└── tbm-theme-2026.9.6.vsix        # Production VSIX distribution package (5.23 MB)
```

---

## 4. Technical Specifications & Color Mathematics

### 4.1 Design Token Architecture
- **Base Surface**: `#0A0A0A` (Luminance: `0.0031`)
- **Seamless Border**: `#0A0A0A` (Flush seams between editor, sidebar, tabs, and terminal)
- **Primary Text**: `#D9D9D9` (Luminance: `0.6868`)
- **Muted Inactive**: `#56575D` (Luminance: `0.0984`)
- **Focal Accent**: `#80CBC4` (Luminance: `0.5241`, Vira Teal)

### 4.2 WCAG Contrast Calculation
$$\text{Relative Luminance } L = 0.2126 \cdot R' + 0.7152 \cdot G' + 0.0722 \cdot B'$$
$$\text{Contrast Ratio } CR = \frac{L_1 + 0.05}{L_2 + 0.05} = \frac{0.6868 + 0.05}{0.0031 + 0.05} = \frac{0.7368}{0.0531} = 14.03:1$$
- **Standard Threshold**: WCAG Level AA requires `4.5:1`; WCAG Level AAA requires `7.0:1`.
- **TBM Theme Performance**: **14.03:1** (Exceeds WCAG AAA requirements).

---

## 5. Engineering Milestones & Deliverables Checklist

- [x] **Milestone 1**: Clean-room extraction of outline font and icon SVGs from target VSIX.
- [x] **Milestone 2**: Formulate declarative manifest in `package.json` with publisher `amanAkhter`.
- [x] **Milestone 3**: Compile uniform `#0A0A0A` surfaces across 34 workbench planes.
- [x] **Milestone 4**: Map 183 outline product icons and verify font loading integrity.
- [x] **Milestone 5**: Map 393 file & folder definitions with authentic carbon SVGs.
- [x] **Milestone 6**: Build AST bundle scanner (`doctor.mjs`) and verify 0 stale keys against Antigravity 1.107.0.
- [x] **Milestone 7**: Formulate non-destructive settings updater with timestamped backups.
- [x] **Milestone 8**: Execute test suite (`validate.mjs`) and package standalone VSIX.
- [x] **Milestone 9**: Complete governance documentation across all AI and project manuals.
