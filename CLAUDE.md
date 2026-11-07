# Claude Code Developer Guide: TBM Theme

This guide provides operational conventions, architecture constraints, and testing commands for Claude Code agents working on the **TBM Theme** repository.

---

## 1. Project Overview & Architecture Constraints

- **Repository Purpose**: Declarative dark theme, outline product icon font, and calm file icon theme for Antigravity IDE and VS Code.
- **Publisher**: Aman Akhter ([https://github.com/amanAkhter](https://github.com/amanAkhter))
- **Primary Theme Label**: `"TBM Theme"` (Path: `themes/tbm-theme.json`)
- **Product Icon Theme**: `"TBM Outline"` (ID: `tbm-outline`, Path: `icons/product-icon-theme.json`)
- **File Icon Theme**: `"TBM Icons"` (ID: `tbm-icons`, Path: `icons/file-icon-theme.json`)

### Core Engineering Rules:
1. **Zero Runtime JavaScript in Extension**: The extension package must NOT contain any `"main"` script in `package.json`. It is purely declarative.
2. **Deterministic Build Pipeline**: Running `npm run build` must produce byte-deterministic output in `themes/`.
3. **WCAG Compliance**: Contrast ratio for `editor.foreground` against `editor.background` must remain $\ge 14.0:1$.
4. **Scope Boundaries**: Do not modify or delete files outside of `/Users/aman/playground/testing/` unless explicitly executing `apply-settings.mjs --apply` after user confirmation.

---

## 2. Essential Commands

| Task | Command | Description |
|---|---|---|
| **Build Themes** | `npm run build` | Compiles `themes/tbm-theme.json` and `themes/tbm-theme-hc.json` |
| **Validate Suite** | `npm run validate` | Runs WCAG contrast, font existence, and SVG path checks |
| **AST Doctor** | `npm run doctor` | Diffs theme keys against `/Applications/Antigravity IDE.app` bundle |
| **Package VSIX** | `npm run package` | Builds standalone `.vsix` distribution without runtime dependencies |
| **Full Install** | `npm run install` | Automates build, validation, packaging, and CLI extension installation |
| **Settings Preview** | `npm run apply-settings` | Previews proposed changes to user `settings.json` (dry run) |
| **Settings Apply** | `node scripts/apply-settings.mjs --apply` | Applies theme settings with automatic safety backup |

---

## 3. Maintenance Checklist for Editor Updates
When Antigravity IDE updates to a new version:
- [x] Run `npm run doctor` to scan for new or deprecated keys.
- [x] Inspect `doctor-report.md`.
- [x] If stale keys exist, prune them in `scripts/build-tbm.mjs`.
- [x] If high-priority unthemed surfaces exist, add overrides in `scripts/build-tbm.mjs`.
- [x] Run `npm run build && npm run validate`.
- [x] Bump patch version in `package.json` and package via `npm run package`.
