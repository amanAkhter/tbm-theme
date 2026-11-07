// scripts/build-burgundy-icons.mjs
// Compiles tailored file & folder icons for TBM Deep Dark Titanium Burgundy

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export function buildBurgundyIcons() {
  const baseThemePath = path.join(rootDir, 'icons', 'file-icon-theme.json');
  const baseTheme = JSON.parse(fs.readFileSync(baseThemePath, 'utf8'));

  const burgundyDir = path.join(rootDir, 'icons', 'burgundy');
  const burgundyFilesDir = path.join(burgundyDir, 'files');
  const burgundyFoldersDir = path.join(burgundyDir, 'folders');

  fs.mkdirSync(burgundyFilesDir, { recursive: true });
  fs.mkdirSync(burgundyFoldersDir, { recursive: true });

  const newDefs = {};

  // 1. Process all icon definitions
  for (const [key, def] of Object.entries(baseTheme.iconDefinitions)) {
    const origRelPath = def.iconPath;
    const origAbsPath = path.resolve(path.join(rootDir, 'icons'), origRelPath);

    if (!fs.existsSync(origAbsPath)) {
      console.warn(`[build-burgundy-icons] Warning: Source icon missing: ${origAbsPath}`);
      continue;
    }

    const svgContent = fs.readFileSync(origAbsPath, 'utf8');

    if (origRelPath.includes('folders/')) {
      const fileName = path.basename(origRelPath);
      let recolored = svgContent;

      if (fileName.includes('_open.svg')) {
        // Open folder: Vibrant Electric Rose accent (#FF7597)
        recolored = recolored
          .replaceAll('#80cbc4', '#FF7597')
          .replaceAll('#80CBC4', '#FF7597')
          .replaceAll('#00b6c2', '#FF8DA1');
      } else {
        // Closed folder: Dark Titanium Wine (#8A4456)
        recolored = recolored
          .replaceAll('#303236', '#8A4456')
          .replaceAll('#66d5cb', '#FF7597')
          .replaceAll('#80cbc4', '#FF7597');
      }

      const outFileName = fileName.replace('.variant.carbon.svg', '.variant.burgundy.svg').replace('.svg', '.burgundy.svg');
      const outPath = path.join(burgundyFoldersDir, outFileName);
      fs.writeFileSync(outPath, recolored, 'utf8');

      newDefs[key] = {
        iconPath: `./burgundy/folders/${outFileName}`
      };
    } else {
      // File icon
      const fileName = path.basename(origRelPath);
      let recolored = svgContent;

      // Replace teals with electric rose (#FF7597)
      recolored = recolored
        .replaceAll('#80cbc4', '#FF7597')
        .replaceAll('#80CBC4', '#FF7597')
        .replaceAll('#66d5cb', '#FF7597')
        .replaceAll('color(display-p3 .502 .7961 .7686)', '#FF7597');

      // Warm slate/cold grey bodies to soft warm titanium rose
      recolored = recolored
        .replaceAll('color(display-p3 .42 .4493 .58)', 'color(display-p3 .75 .52 .60)')
        .replaceAll('color(display-p3 .698 .8 .8392)', 'color(display-p3 .84 .70 .76)')
        .replaceAll('color(display-p3 .2039 .2235 .2667)', 'color(display-p3 .28 .12 .16)')
        .replaceAll('color(display-p3 .1469 .1756 .2281)', 'color(display-p3 .22 .08 .12)')
        .replaceAll('#6b7394', '#A87682')
        .replaceAll('#b2ccd6', '#D6B5BD');

      const outPath = path.join(burgundyFilesDir, fileName);
      fs.writeFileSync(outPath, recolored, 'utf8');

      newDefs[key] = {
        iconPath: `./burgundy/files/${fileName}`
      };
    }
  }

  // 2. Build file-icon-theme-burgundy.json
  const burgundyTheme = {
    ...baseTheme,
    iconDefinitions: newDefs
  };

  const outThemePath = path.join(rootDir, 'icons', 'file-icon-theme-burgundy.json');
  fs.writeFileSync(outThemePath, JSON.stringify(burgundyTheme, null, 2) + '\n', 'utf8');
  console.log(`[build-burgundy-icons] Generated ${Object.keys(newDefs).length} icons into ${outThemePath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildBurgundyIcons();
}
