# Changelog

## [2026.9.6] - 2026-11-07

### Added
- **TBM Dark Navy Blue Color Theme**: Deep dark midnight navy variant (`#010414` uniform base & seamless borders) with electric sky blue (`#38BDF8`) accents, frosted silver-white (`#E2E8F0`) text, emerald mint (`#4ADE80`) strings, cobalt blue (`#60A5FA`) functions, sunset amber (`#FB923C`) numbers, and slate steel (`#546A8C`) comments. Exceeds WCAG AAA with **16.12:1** contrast ratio.
- **TBM Dark Navy Blue Icons**: Dedicated file icon theme matching the Dark Navy Blue aesthetic, featuring deep dark midnight navy closed folders (`#0E2254`), vibrant electric sky blue open folders (`#38BDF8`), and frosted slate/navy file glyphs across 393 icons.
- **TBM Deep Dark Titanium Burgundy Color Theme**: Ultra-dark iPhone Pro titanium burgundy variant (`#100306` uniform obsidian wine base) with electric rose (`#FF7597`) accents, crisp rose-cream (`#F5E8EB`) text, sage mint (`#A8E6CF`) strings, cornflower periwinkle (`#7EB7E8`) functions, and dusty mauve (`#8A5D66`) comments. Exceeds WCAG AAA with **16.98:1** contrast ratio.
- **TBM Deep Dark Titanium Burgundy File Icons**: Dedicated file icon theme matching the Titanium Burgundy aesthetic, featuring deep titanium wine closed folders (`#5E2633`), glowing electric rose open folders (`#FF7597`), and harmonized file glyphs.
- **Renamed to TBM Theme**: Published by Aman Akhter ([https://github.com/amanAkhter](https://github.com/amanAkhter)).
- **TBM Theme (Uniform Edition)**: Full 294 workbench color keys unified across all surfaces (`editor`, `editorGutter`, `sideBar`, `tabs`, `statusBar`, `activityBar`, `terminal`, `panel`, `minimap`, and `menu` all share base `#0A0A0A` with seamless `#0A0A0A` borders and signature `#80CBC4` teal accents).
- **TBM Theme High Contrast**: Pure black `#000000` pitch base with crisp syntax highlighting and unified borders.
- **TBM Outline Product Icon Theme**: Extracted authentic outline font (183 outline glyph definitions) mapped into `icons/product-icon-theme.json` with ID `tbm-outline`.
- **TBM Icons File Icon Theme**: Complete catalog of 393 file & folder definitions with authentic carbon SVGs in `icons/files/` and `icons/folders/` under ID `tbm-icons`.
- **Antigravity Update Resilience**: `scripts/doctor.mjs` directly parses `/Applications/Antigravity IDE.app`'s workbench bundle to safeguard against breaking changes and color/icon drifts across IDE updates.
- **Pure Declarative Architecture**: Zero JavaScript runtime code, removing all obfuscated license checks, trial timebombs, and background telemetry.
