# Third-Party Licenses, Provenance & Attribution Ledger

This document provides a complete provenance and attribution ledger for all third-party components, icon fonts, and assets utilized or referenced within the **TBM Theme** extension.

---

## 1. Provenance & Asset Attribution Summary

| Asset / Component | Origin / Reference | License / Terms | Usage in TBM Theme |
|---|---|---|---|
| **Outline Product Icons Font** | `vira-ui-icons-outline.woff2` | Custom / Fair Use Interoperability | 183 outline product icon glyphs mapped in `icons/product-icon-theme.json` |
| **Material File & Folder SVGs** | Material Icon Set / Philipp Kief | MIT License | 271 file SVGs and folder glyphs in `icons/files/` and `icons/folders/` |
| **VS Code Codicons** | Microsoft Corporation | CC-BY-4.0 / MIT | UI product icon reference codepoints and fallback outline symbols |
| **Packaging Utility** | `@vscode/vsce` (Microsoft) | MIT License | Build-time extension packaging harness (`npx @vscode/vsce`) |

---

## 2. Component Licenses

### 2.1 Microsoft VS Code Codicons
```
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Creative Commons Attribution 4.0 International License (CC-BY-4.0)
and the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### 2.2 Material File & Folder Icons
```
MIT License
Copyright (c) Philipp Kief

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 3. Interoperability & Decoupling Disclosure

TBM Theme was created using the REA (Reverse Engineering Anything) protocol for the purpose of research, software interoperability, and custom IDE personalization in **Antigravity IDE**.

- **Decoupled Architecture**: All proprietary licensing verification daemons, machine identification trackers, and network phoning scripts (`build/index.js`) present in upstream packages have been completely removed.
- **Zero Executable Code**: The distributed extension contains strictly declarative JSON manifests (`contributes.themes`, `contributes.productIconThemes`, `contributes.iconThemes`), offline vector SVGs, and WOFF2 font files.
- **Personal & Research Use**: Authored and maintained by Aman Akhter ([https://github.com/amanAkhter](https://github.com/amanAkhter)).
