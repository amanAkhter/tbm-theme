# Engineering Requirements & AI System Specification: TBM Theme

## 1. System Role & Project Purpose
You are an expert principal software engineer and reverse-engineering specialist tasked with analyzing, decoupling, and recreating the commercial **Vira Theme** (`vira.vsc-vira-theme`) into **TBM Theme** — a high-performance, update-proof, 100% declarative extension for **Antigravity IDE** and **VS Code**.

## 2. Core Requirements & Constraints

### 2.1 Clean-Room & Declarative Decoupling
- **Zero Runtime JavaScript**: Eliminate all proprietary licensing engines, telemetry daemons, machine ID collectors, and expiration timebombs (`build/index.js`). The resulting extension must contain zero executable scripts in the extension host.
- **Native Extension Manifest**: Structure `package.json` purely through declarative contribution points (`contributes.themes`, `contributes.productIconThemes`, `contributes.iconThemes`).

### 2.2 Uniform Dark Surface Aesthetics
- Standardize all UI background planes (`editor`, `editorGutter`, `sideBar`, `tabs`, `statusBar`, `activityBar`, `terminal`, `panel`, `minimap`, `breadcrumb`, `menu`, etc.) to seamless `#0A0A0A`.
- Eliminate all contrasting dividing lines by setting structural borders (`editorGroup.border`, `sideBar.border`, `statusBar.border`, `tab.border`, `panel.border`) to `#0A0A0A`.
- Retain high-contrast focal highlights with `#80CBC4` (Vira Teal) on active indicators (`tab.activeBorderTop`, `activityBar.activeBorder`, `terminal.tab.activeBorder`, badges).

### 2.3 Asset Integrity
- Product icon theme: Maintain 183 outline product icon definitions mapped to `fonts/vira-ui-icons-outline.woff2`.
- File icon theme: Maintain 393 file and folder definitions with authentic carbon SVGs in `icons/files/` and `icons/folders/`.
- Ensure all relative asset paths resolve cleanly within the VSIX package.

### 2.4 Antigravity IDE Update Resilience
- Build an automated AST diagnostic tool (`scripts/doctor.mjs`) to inspect the internal bundled JavaScript of the host editor (`workbench.desktop.main.js`) on every IDE update.
- Ensure zero stale or deprecated color/icon keys remain unhandled.

### 2.5 Verification & Governance
- WCAG contrast ratios must exceed 4.5:1 (AA) and target 14:1+ (AAA) for editor text against background.
- Provide automated settings management with atomic timestamped backups before updating user configurations.
- Maintain comprehensive documentation across `PLAN.md`, `PHASES.MD`, `PostCreation.md`, and `CHANGELOG.md`.
