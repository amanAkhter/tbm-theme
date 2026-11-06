// scripts/build-theme.mjs
// Deterministically compiles palette.json + workbench-map.json + tokens-map.json into themes/*.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function resolveColor(ref, palette) {
  if (!ref || typeof ref !== 'string') return ref;
  if (ref.startsWith('#')) return ref;

  const parts = ref.split('.');
  let val = palette;
  for (const part of parts) {
    if (val && typeof val === 'object' && part in val) {
      val = val[part];
    } else {
      throw new Error(`Color reference not found in palette: "${ref}"`);
    }
  }
  return val;
}

function compileTheme(palette, workbenchMap, tokensMap, options = {}) {
  const { name, type = 'dark', uiTheme = 'vs-dark', noItalic = false, highContrast = false } = options;

  // Clone palette to apply variant overrides
  const effectivePalette = JSON.parse(JSON.stringify(palette));

  if (options.accentOverride) {
    effectivePalette.accent = options.accentOverride;
  }

  if (highContrast) {
    effectivePalette.surfaces.surface0 = '#000000';
    effectivePalette.surfaces.surface1 = '#090b0e';
    effectivePalette.surfaces.surface2 = '#11141a';
    effectivePalette.surfaces.surface3 = '#181d26';
    effectivePalette.surfaces.border = '#3b4353';
    effectivePalette.surfaces.borderSubtle = '#2a313d';
    effectivePalette.text.primary = '#ffffff';
    effectivePalette.text.secondary = '#b4bcc8';
  }

  // Resolve workbench colors and sort keys for strict determinism
  const resolvedColors = {};
  const sortedColorKeys = Object.keys(workbenchMap).sort();
  for (const key of sortedColorKeys) {
    resolvedColors[key] = resolveColor(workbenchMap[key], effectivePalette);
  }

  if (highContrast) {
    resolvedColors['contrastBorder'] = effectivePalette.surfaces.border;
    resolvedColors['focusBorder'] = effectivePalette.accent.primary;
  }

  // Resolve token colors
  const resolvedTokenColors = (tokensMap.tokenColors || []).map((token) => {
    const settings = { ...token.settings };
    if (settings.foreground) {
      settings.foreground = resolveColor(settings.foreground, effectivePalette);
    }
    if (noItalic && settings.fontStyle) {
      const styles = settings.fontStyle.split(/\s+/).filter((s) => s !== 'italic');
      if (styles.length > 0) {
        settings.fontStyle = styles.join(' ');
      } else {
        delete settings.fontStyle;
      }
    }
    return {
      name: token.name,
      scope: token.scope,
      settings
    };
  });

  // Resolve semantic token colors
  const resolvedSemanticTokenColors = {};
  if (tokensMap.semanticTokenColors) {
    const sortedSemanticKeys = Object.keys(tokensMap.semanticTokenColors).sort();
    for (const key of sortedSemanticKeys) {
      resolvedSemanticTokenColors[key] = resolveColor(tokensMap.semanticTokenColors[key], effectivePalette);
    }
  }

  return {
    $schema: 'vscode://schemas/color-theme',
    name,
    type,
    semanticHighlighting: true,
    colors: resolvedColors,
    tokenColors: resolvedTokenColors,
    semanticTokenColors: resolvedSemanticTokenColors
  };
}

export function buildTheme() {
  const palettePath = path.join(rootDir, 'src', 'palette.json');
  const workbenchMapPath = path.join(rootDir, 'src', 'workbench-map.json');
  const tokensMapPath = path.join(rootDir, 'src', 'tokens-map.json');
  const themesDir = path.join(rootDir, 'themes');

  const palette = JSON.parse(fs.readFileSync(palettePath, 'utf8'));
  const workbenchMap = JSON.parse(fs.readFileSync(workbenchMapPath, 'utf8'));
  const tokensMap = JSON.parse(fs.readFileSync(tokensMapPath, 'utf8'));

  fs.mkdirSync(themesDir, { recursive: true });

  const variants = [
    {
      fileName: 'carbonline-dark.json',
      options: { name: 'Carbonline Dark' }
    },
    {
      fileName: 'carbonline-dark-no-italic.json',
      options: { name: 'Carbonline Dark (No Italic)', noItalic: true }
    },
    {
      fileName: 'carbonline-dark-hc.json',
      options: { name: 'Carbonline Dark High Contrast', highContrast: true, type: 'hcBlack' }
    },
    {
      fileName: 'carbonline-dark-amber.json',
      options: { name: 'Carbonline Dark Amber', accentOverride: palette.accents?.amber }
    },
    {
      fileName: 'carbonline-dark-emerald.json',
      options: { name: 'Carbonline Dark Emerald', accentOverride: palette.accents?.emerald }
    },
    {
      fileName: 'carbonline-dark-sky.json',
      options: { name: 'Carbonline Dark Sky', accentOverride: palette.accents?.sky }
    },
    {
      fileName: 'carbonline-dark-violet.json',
      options: { name: 'Carbonline Dark Violet', accentOverride: palette.accents?.violet }
    }
  ];

  for (const { fileName, options } of variants) {
    const compiled = compileTheme(palette, workbenchMap, tokensMap, options);
    const outputPath = path.join(themesDir, fileName);
    fs.writeFileSync(outputPath, JSON.stringify(compiled, null, 2) + '\n', 'utf8');
    console.log(`[build-theme] Compiled: ${fileName} (${Object.keys(compiled.colors).length} colors)`);
  }
}

// Run when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTheme();
}
