// scripts/validate.mjs
// Validates JSON formatting, hex color codes, WCAG contrast ratios, and icon assets

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function parseHex(hex) {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const a = cleaned.length === 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function getLuminance(r, g, b) {
  const [sR, sG, sB] = [r, g, b].map((val) => {
    const c = val / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function getContrastRatio(hex1, hex2) {
  const c1 = parseHex(hex1);
  const c2 = parseHex(hex2);

  const r1 = Math.round(c1.r * c1.a);
  const g1 = Math.round(c1.g * c1.a);
  const b1 = Math.round(c1.b * c1.a);

  const r2 = Math.round(c2.r * c2.a);
  const g2 = Math.round(c2.g * c2.a);
  const b2 = Math.round(c2.b * c2.a);

  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function validateThemeJson(themePath) {
  const errors = [];
  if (!fs.existsSync(themePath)) {
    errors.push(`Theme file does not exist: ${themePath}`);
    return errors;
  }

  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  if (!theme.colors || typeof theme.colors !== 'object') {
    errors.push('Theme missing valid "colors" object');
    return errors;
  }

  for (const [key, color] of Object.entries(theme.colors)) {
    if (!HEX_REGEX.test(color)) {
      errors.push(`Invalid hex in theme color: ${key} = "${color}"`);
    }
  }

  // Check critical WCAG contrast
  const editorBg = theme.colors['editor.background'] || '#0A0A0A';
  const editorFg = theme.colors['editor.foreground'] || '#D9D9D9';
  const fgRatio = getContrastRatio(editorFg, editorBg);
  console.log(`[validate] ${path.basename(themePath)}: editor.foreground (${editorFg}) vs editor.background (${editorBg}) = ${fgRatio.toFixed(2)}:1`);

  if (fgRatio < 4.5) {
    errors.push(`Contrast failure: editor.foreground vs editor.background is ${fgRatio.toFixed(2)}:1 (minimum 4.5:1 required)`);
  }

  return errors;
}

function validateProductIcons() {
  const errors = [];
  const themePath = path.join(rootDir, 'icons', 'product-icon-theme.json');
  if (!fs.existsSync(themePath)) {
    errors.push('icons/product-icon-theme.json not found');
    return errors;
  }

  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const fonts = theme.fonts || [];
  if (fonts.length === 0) {
    errors.push('product-icon-theme.json missing fonts definition');
  }

  for (const font of fonts) {
    const srcList = font.src || [];
    for (const src of srcList) {
      const fontRelPath = src.path;
      const fontAbsPath = path.resolve(path.join(rootDir, 'icons'), fontRelPath);
      if (!fs.existsSync(fontAbsPath)) {
        errors.push(`Product icon font not found: ${fontAbsPath}`);
      } else {
        const size = fs.statSync(fontAbsPath).size;
        console.log(`[validate] Product icon font verified: ${path.basename(fontAbsPath)} (${(size / 1024).toFixed(2)} KB)`);
      }
    }
  }

  const iconDefs = theme.iconDefinitions || {};
  const count = Object.keys(iconDefs).length;
  console.log(`[validate] Product icons defined: ${count}`);
  if (count === 0) {
    errors.push('No product icons defined');
  }

  return errors;
}

function validateFileIcons(themeFileName = 'file-icon-theme.json') {
  const errors = [];
  const themePath = path.join(rootDir, 'icons', themeFileName);
  if (!fs.existsSync(themePath)) {
    errors.push(`icons/${themeFileName} not found`);
    return errors;
  }

  const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  const defs = theme.iconDefinitions || {};
  const defCount = Object.keys(defs).length;

  console.log(`[validate] ${themeFileName} definitions count: ${defCount}`);
  if (defCount === 0) {
    errors.push(`${themeFileName} has 0 icon definitions`);
  }

  if (!theme.file || !defs[theme.file]) {
    errors.push(`${themeFileName} missing default "file" definition`);
  }
  if (!theme.folder || !defs[theme.folder]) {
    errors.push(`${themeFileName} missing default "folder" definition`);
  }

  let missingCount = 0;
  for (const [id, def] of Object.entries(defs)) {
    if (!def.iconPath) {
      errors.push(`Definition ${id} missing iconPath`);
    } else {
      const fullPath = path.resolve(path.join(rootDir, 'icons'), def.iconPath);
      if (!fs.existsSync(fullPath)) {
        if (missingCount < 5) errors.push(`Referenced file icon missing on disk: ${fullPath} (for ${id})`);
        missingCount++;
      }
    }
  }

  if (missingCount > 0) {
    errors.push(`Total missing icon files on disk: ${missingCount}`);
  } else {
    console.log(`[validate] All ${defCount} icon files in ${themeFileName} verified present on disk.`);
  }

  return errors;
}

export function validateAll() {
  console.log('=== TBM Theme Validation Suite ===\n');
  let hasErrors = false;

  // 1. Validate TBM theme
  const tbmPath = path.join(rootDir, 'themes', 'tbm-theme.json');
  const tbmErrors = validateThemeJson(tbmPath);
  if (tbmErrors.length > 0) {
    console.error('[validate] TBM Theme errors:');
    tbmErrors.forEach((e) => console.error(`  - ${e}`));
    hasErrors = true;
  } else {
    console.log('[validate] TBM Theme validation passed.');
  }

  // 2. Validate TBM Burgundy theme
  const burgundyPath = path.join(rootDir, 'themes', 'tbm-burgundy.json');
  if (fs.existsSync(burgundyPath)) {
    const burgundyErrors = validateThemeJson(burgundyPath);
    if (burgundyErrors.length > 0) {
      console.error('[validate] TBM Burgundy theme errors:');
      burgundyErrors.forEach((e) => console.error(`  - ${e}`));
      hasErrors = true;
    } else {
      console.log('[validate] TBM Burgundy theme validation passed.');
    }
  }

  // 3. Validate TBM HC theme
  const hcPath = path.join(rootDir, 'themes', 'tbm-theme-hc.json');
  if (fs.existsSync(hcPath)) {
    const hcErrors = validateThemeJson(hcPath);
    if (hcErrors.length > 0) {
      console.error('[validate] TBM Theme HC errors:');
      hcErrors.forEach((e) => console.error(`  - ${e}`));
      hasErrors = true;
    } else {
      console.log('[validate] TBM Theme HC validation passed.');
    }
  }

  // 3. Validate product icons
  const productErrors = validateProductIcons();
  if (productErrors.length > 0) {
    console.error('[validate] Product icon errors:');
    productErrors.forEach((e) => console.error(`  - ${e}`));
    hasErrors = true;
  } else {
    console.log('[validate] Product icon font & definitions passed.');
  }

  // 4. Validate file icons (Carbon & Burgundy)
  const fileErrors = validateFileIcons('file-icon-theme.json');
  const burgundyFileErrors = validateFileIcons('file-icon-theme-burgundy.json');
  const combinedFileErrors = [...fileErrors, ...burgundyFileErrors];
  if (combinedFileErrors.length > 0) {
    console.error('[validate] File icon errors:');
    combinedFileErrors.forEach((e) => console.error(`  - ${e}`));
    hasErrors = true;
  } else {
    console.log('[validate] File icon mappings & SVGs verified for both icon suites.');
  }

  if (hasErrors) {
    console.error('\n❌ Validation FAILED.');
    process.exit(1);
  } else {
    console.log('\n✅ All checks PASSED successfully.');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateAll();
}
