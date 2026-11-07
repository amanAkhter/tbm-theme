# Gemini / Antigravity Agent Directives: TBM Theme

This document governs the behavior, constraints, and verification protocols for Gemini and Antigravity agents operating on the **TBM Theme** project.

---

## 1. Operating Directives

- **Context Window Discipline**: Minimize context clutter by keeping scripts modular and delegating deep AST scans to `scripts/doctor.mjs`.
- **Validation Before Packaging**: Always run `npm run validate` before generating new VSIX artifacts.
- **Safety Backups**: Always create a timestamped backup before touching `settings.json`.

---

## 2. Technical Milestones & Verification Checklist

- [x] **2.1 Host Environment Audited**: Confirmed Antigravity IDE 1.107.0 with VS Code base.
- [x] **2.2 Target Decompiled & Audited**: Extracted assets from target VSIX and removed licensing engine.
- [x] **2.3 Uniform Color System Compiled**: Generated `themes/tbm-theme.json` with 294 keys at `#0A0A0A` background/borders and `#80CBC4` accents.
- [x] **2.4 High Contrast Theme Compiled**: Generated `themes/tbm-theme-hc.json` with `#000000` pitch base.
- [x] **2.5 Outline Icon Font Integrated**: Configured `fonts/vira-ui-icons-outline.woff2` (183 outline glyphs).
- [x] **2.6 File Icon Catalog Verified**: Verified 393 file & folder definitions with all local SVG assets.
- [x] **2.7 AST Doctor Script Verified**: Validated 0 stale keys in `doctor-report.md`.
- [x] **2.8 Non-Destructive Settings Manager**: Verified dry-run default in `scripts/apply-settings.mjs`.
- [x] **2.9 Production Package Built**: Built `tbm-theme-2026.9.6.vsix` (5.23 MB).
- [x] **2.10 Publisher Attribution Set**: Set publisher to `amanAkhter` and author to Aman Akhter ([https://github.com/amanAkhter](https://github.com/amanAkhter)).
