# Changelog

## [2026.9.6] - 2026-11-07

### Added
- **TBM Burgundy Color Theme Variant**: New luxurious deep wine velvet variant (`#27060f` uniform base) with electric rose (`#FF7597`) accents, warm cream (`#F1E4E8`) text, sage mint (`#A8D5BA`) strings, periwinkle (`#7EB7E8`) functions, and dusty mauve (`#B37D8A`) comments. Exceeds WCAG AAA with **15.19:1** contrast ratio.
- **Renamed to TBM Theme**: Published by Aman Akhter ([https://github.com/amanAkhter](https://github.com/amanAkhter)).
- **TBM Theme (Uniform Edition)**: Full 294 workbench color keys unified across all surfaces (`editor`, `editorGutter`, `sideBar`, `tabs`, `statusBar`, `activityBar`, `terminal`, `panel`, `minimap`, and `menu` all share base `#0A0A0A` with seamless `#0A0A0A` borders and signature `#80CBC4` teal accents).
- **TBM Theme High Contrast**: Pure black `#000000` pitch base with crisp syntax highlighting and unified borders.
- **TBM Outline Product Icon Theme**: Extracted authentic outline font (183 outline glyph definitions) mapped into `icons/product-icon-theme.json` with ID `tbm-outline`.
- **TBM Icons File Icon Theme**: Complete catalog of 393 file & folder definitions with authentic carbon SVGs in `icons/files/` and `icons/folders/` under ID `tbm-icons`.
- **Antigravity Update Resilience**: `scripts/doctor.mjs` directly parses `/Applications/Antigravity IDE.app`'s workbench bundle to safeguard against breaking changes and color/icon drifts across IDE updates.
- **Pure Declarative Architecture**: Zero JavaScript runtime code, removing all obfuscated license checks, trial timebombs, and background telemetry.
