// scripts/build-product-icons.mjs
// Compiles SVGs in src/icons/product into fonts/carbonline-icons.woff2 and icons/product-icon-theme.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export function buildProductIcons() {
  const productMapPath = path.join(rootDir, 'src', 'icons', 'product-map.json');
  const productIconsDir = path.join(rootDir, 'src', 'icons', 'product');
  const fontsDir = path.join(rootDir, 'fonts');
  const outputThemePath = path.join(rootDir, 'icons', 'product-icon-theme.json');

  if (!fs.existsSync(productMapPath)) {
    throw new Error('product-map.json not found');
  }

  const productMap = JSON.parse(fs.readFileSync(productMapPath, 'utf8'));

  // Ensure output dirs exist
  fs.mkdirSync(fontsDir, { recursive: true });
  fs.mkdirSync(path.dirname(outputThemePath), { recursive: true });

  // Create codepoints mapping for fantasticon: { [iconBaseName]: decimalCodepoint }
  const codepoints = {};
  const iconDefinitions = {};

  for (const [id, def] of Object.entries(productMap)) {
    const rawChar = def.fontCharacter.replace('\\', '');
    const codeDec = parseInt(rawChar, 16);
    const iconName = def.svg.replace('.svg', '');
    codepoints[iconName] = codeDec;
    iconDefinitions[id] = {
      fontCharacter: def.fontCharacter
    };
  }

  const configPath = path.join(rootDir, '.cache', 'fantasticon.json');
  fs.mkdirSync(path.dirname(configPath), { recursive: true });

  const fantasticonConfig = {
    inputDir: productIconsDir,
    outputDir: fontsDir,
    name: 'carbonline-icons',
    fontTypes: ['woff2'],
    assetTypes: ['json'],
    formatOptions: {
      json: {
        indent: 2
      }
    },
    codepoints
  };

  fs.writeFileSync(configPath, JSON.stringify(fantasticonConfig, null, 2), 'utf8');

  console.log('[build-product-icons] Building WOFF2 font with fantasticon...');
  try {
    execSync(
      `npx --yes fantasticon -c "${configPath}"`,
      { cwd: rootDir, stdio: 'inherit' }
    );
  } catch (err) {
    console.error('[build-product-icons] Error running fantasticon:', err.message);
    throw err;
  }

  // Construct product-icon-theme.json
  const productIconTheme = {
    $schema: 'vscode://schemas/product-icon-theme',
    fonts: [
      {
        id: 'carbonline-icons',
        src: [
          {
            path: '../fonts/carbonline-icons.woff2',
            format: 'woff2'
          }
        ],
        weight: 'normal',
        style: 'normal'
      }
    ],
    iconDefinitions
  };

  fs.writeFileSync(outputThemePath, JSON.stringify(productIconTheme, null, 2) + '\n', 'utf8');
  console.log(`[build-product-icons] Generated ${outputThemePath}`);

  // Check font size
  const fontFile = path.join(fontsDir, 'carbonline-icons.woff2');
  if (fs.existsSync(fontFile)) {
    const stats = fs.statSync(fontFile);
    console.log(`[build-product-icons] Font file size: ${(stats.size / 1024).toFixed(2)} KB`);
    if (stats.size > 100 * 1024) {
      throw new Error(`Font file exceeds 100 KB: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  } else {
    throw new Error(`Font file was not created: ${fontFile}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildProductIcons();
}
