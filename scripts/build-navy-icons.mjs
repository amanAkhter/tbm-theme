// scripts/build-navy-icons.mjs
// Compiles tailored file & folder icons for TBM Dark Navy Blue Icons

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export function buildNavyIcons() {
  const baseThemePath = path.join(rootDir, 'icons', 'file-icon-theme.json');
  const baseTheme = JSON.parse(fs.readFileSync(baseThemePath, 'utf8'));

  const navyDir = path.join(rootDir, 'icons', 'navy');
  const navyFilesDir = path.join(navyDir, 'files');
  const navyFoldersDir = path.join(navyDir, 'folders');

  fs.mkdirSync(navyFilesDir, { recursive: true });
  fs.mkdirSync(navyFoldersDir, { recursive: true });

  const newDefs = {};

  // 1. Process all icon definitions
  for (const [key, def] of Object.entries(baseTheme.iconDefinitions)) {
    const origRelPath = def.iconPath;
    const origAbsPath = path.resolve(path.join(rootDir, 'icons'), origRelPath);

    if (!fs.existsSync(origAbsPath)) {
      console.warn(`[build-navy-icons] Warning: Source icon missing: ${origAbsPath}`);
      continue;
    }

    const svgContent = fs.readFileSync(origAbsPath, 'utf8');

    if (origRelPath.includes('folders/')) {
      const fileName = path.basename(origRelPath);
      let recolored = svgContent;

      if (fileName.includes('_open.svg')) {
        // Open folder: Vibrant Electric Sky Blue (#38BDF8)
        recolored = recolored
          .replaceAll('#80cbc4', '#38BDF8')
          .replaceAll('#80CBC4', '#38BDF8')
          .replaceAll('#00b6c2', '#67E8F9');
      } else {
        // Closed folder: Deep Dark Midnight Navy (#0E2254) with sky accent (#38BDF8)
        recolored = recolored
          .replaceAll('#303236', '#0E2254')
          .replaceAll('#66d5cb', '#38BDF8')
          .replaceAll('#80cbc4', '#38BDF8');
      }

      const outFileName = fileName.replace('.variant.carbon.svg', '.variant.navy.svg').replace('.svg', '.navy.svg');
      const outPath = path.join(navyFoldersDir, outFileName);
      fs.writeFileSync(outPath, recolored, 'utf8');

      newDefs[key] = {
        iconPath: `./navy/folders/${outFileName}`
      };
    } else {
      // File icon
      const fileName = path.basename(origRelPath);
      let recolored = svgContent;

      // Replace teals with electric sky cyan (#38BDF8)
      recolored = recolored
        .replaceAll('#80cbc4', '#38BDF8')
        .replaceAll('#80CBC4', '#38BDF8')
        .replaceAll('#66d5cb', '#38BDF8')
        .replaceAll('color(display-p3 .502 .7961 .7686)', '#38BDF8');

      // Cool grays/slates to deep dark frosted navy tones
      recolored = recolored
        .replaceAll('color(display-p3 .42 .4493 .58)', 'color(display-p3 .35 .48 .68)')
        .replaceAll('color(display-p3 .698 .8 .8392)', 'color(display-p3 .65 .78 .92)')
        .replaceAll('color(display-p3 .2039 .2235 .2667)', 'color(display-p3 .04 .08 .20)')
        .replaceAll('color(display-p3 .1469 .1756 .2281)', 'color(display-p3 .02 .04 .12)')
        .replaceAll('#6b7394', '#546A8C')
        .replaceAll('#b2ccd6', '#8AA3C7')
        .replaceAll('#303236', '#0E2254');

      const outPath = path.join(navyFilesDir, fileName);
      fs.writeFileSync(outPath, recolored, 'utf8');

      newDefs[key] = {
        iconPath: `./navy/files/${fileName}`
      };
    }
  }

  // 2. Build file-icon-theme-navy.json
  const navyTheme = {
    ...baseTheme,
    iconDefinitions: newDefs
  };

  const outThemePath = path.join(rootDir, 'icons', 'file-icon-theme-navy.json');
  fs.writeFileSync(outThemePath, JSON.stringify(navyTheme, null, 2) + '\n', 'utf8');
  console.log(`[build-navy-icons] Generated ${Object.keys(newDefs).length} icons into ${outThemePath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildNavyIcons();
}

