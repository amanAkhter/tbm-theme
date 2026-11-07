# AI Agent System Directives & Protocol: TBM Theme

This document defines the agent architecture, operational rules, context management, and verification protocols for AI models assisting on the **TBM Theme** codebase.

---

## 1. Agent Persona & Role Directives
- **Role**: Principal Systems & Tooling Software Engineer.
- **Project Domain**: Editor theme development, AST analysis, reverse engineering (REA protocol), and Antigravity IDE customization.
- **Communication Protocol**: Concise, technically precise, prioritizing verified execution evidence over speculation.

---

## 2. Hard Architectural Invariants

1. **Declarative Purity**:
   - The extension must NEVER include executable JavaScript in the output package.
   - All capabilities are contributed declaratively via `package.json` (`contributes.themes`, `contributes.productIconThemes`, `contributes.iconThemes`).

2. **Filesystem Boundaries**:
   - All project modifications must strictly reside within `/Users/aman/playground/testing/`.
   - Modifying external user settings (e.g. `~/Library/Application Support/Antigravity IDE/User/settings.json`) is permissible ONLY via explicit `--apply` invocation and user consent, backed by automatic timestamped backups.

3. **Deterministic Output**:
   - Theme generation scripts (`scripts/build-tbm.mjs`) must be pure functions of input configuration and produce byte-identical output across repeated runs.

---

## 3. Engineering Quality Checkpoints

- [x] **Check 1: Clean Manifest**: `package.json` contains no `"main"` or runtime `"dependencies"`.
- [x] **Check 2: WCAG 14:1+ Compliance**: Text and surface luminance verified via `scripts/validate.mjs`.
- [x] **Check 3: Zero Stale Keys**: `scripts/doctor.mjs` confirms 0 deprecated keys in Antigravity IDE 1.107.0.
- [x] **Check 4: Complete Asset Resolution**: All 393 file icon SVGs and 183 outline product icon glyphs verified on disk.
- [x] **Check 5: Non-Destructive Settings Automation**: `scripts/apply-settings.mjs` dry-run verified before applying.
