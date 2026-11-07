# Antigravity IDE AST Health Audit Report: TBM Theme

*Generated on: 7 November 2026, 17:00:00 IST*
*Host Environment: Antigravity IDE 1.107.0 (Darwin arm64)*

---

## 1. Host Environment Profile
- **Target Editor**: Antigravity IDE
- **Release Version**: `1.107.0`
- **Underlying VS Code Engine Base**: `1.107.0`
- **Engine Compatibility Range**: `^1.85.0`
- **Compatibility Status**: ✅ **100% Fully Compatible**
- **Binary Inspection Path**: `/Applications/Antigravity IDE.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js`

---

## 2. Registry Compatibility & AST Audit

| Metric | Measured Value | Threshold / Target | Status |
|---|---|---|---|
| **Theme Defined Workbench Colors** | 294 | > 250 | ✅ Passed |
| **Editor Known Registered Colors** | 906 | Variable | ✅ Audited |
| **Stale / Obsolete Theme Keys** | **0** | **0 required** | ✅ Zero Stale Keys |
| **Editor Known Product Icon IDs** | 653 | Variable | ✅ Audited |
| **Product Icons Defined (Outline)** | 183 | 183 required | ✅ 100% Coverage |
| **File / Folder Definitions** | 393 | 393 required | ✅ 100% Mapped |
| **Referenced Assets on Disk** | 393 / 393 | 100% | ✅ Zero Broken Paths |

---

## 3. Stale Keys Audit (Deprecated in Host Editor)
- **Status**: **Zero Stale Keys Detected**.
- All deprecated or undocumented keys (`extensionButton.border`, `surface.border`, `agentsPanel.border`, etc.) were pruned during the build pass.

---

## 4. Priority Unthemed Surfaces (Informational)
The following keys are defined by newer Antigravity IDE agent and chat components. They gracefully inherit default fallback styles and can be styled in subsequent passes:
- `chat.avatarBackground`
- `chat.requestBackground`
- `agentSessionReadIndicator.foreground`
- `chat.linesAddedForeground`
- `chat.linesRemovedForeground`
- `editor.inactiveLineHighlightBackground`
- `editor.inlineValuesBackground`

---

## 5. Final Health Verdict
✅ **HEALTHY & UPDATE RESILIENT**: Zero breaking stale keys, zero runtime script overhead, and full declarative compatibility with Antigravity IDE 1.107.0+.
