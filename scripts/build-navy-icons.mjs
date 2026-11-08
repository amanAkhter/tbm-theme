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

  const closedBadgeColors = [
    '#66d5cb', '#89ddff', '#dcf7b5', '#f9b7a4', '#fff', '#ffffff',
    '#aee33e', '#ffcb6b', '#f5f7f9', '#c3e88d', '#ff8b8b', '#f69dd5',
    '#f78c6c', '#6b7394', '#f7f7f7', '#82aaff', '#4775d1', '#2ecc71',
    '#b2ccd6', '#916b53', '#8472f3', '#697da5', '#fa6068', '#80cbc4',
    '#00b6c2', '#d14748', '#935edd', '#5654bc', '#c792ea', '#bb80b3',
    '#69a7d3', '#3965bd'
  ];

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
        // Open folder: Vibrant Electric Sky Blue (#38BDF8) - bright glowing accent with luminous pocket
        recolored = recolored
          .replaceAll('#80cbc4', '#38BDF8')
          .replaceAll('#80CBC4', '#38BDF8')
          .replaceAll('#00b6c2', '#67E8F9')
          .replaceAll('opacity=".16"', 'opacity=".36"');
      } else {
        // Closed folder: Dimmed Slate Cobalt (#304866) - calm, quiet, recognizable but clearly dimmed
        // 1. Base folder body & pockets
        recolored = recolored
          .replaceAll('#303236', '#304866')
          .replaceAll('#4a616c', '#304866')
          .replaceAll('#343944', '#304866')
          .replaceAll('color(display-p3 .2902 .3804 .4235)', '#304866')
          .replaceAll('opacity=".16"', 'opacity=".12"')
          .replaceAll('opacity=".18"', 'opacity=".12"');

        // 2. Dim all badge and accent colors to calm mid-slate cobalt (#507299)
        for (const col of closedBadgeColors) {
          recolored = recolored.replaceAll(col, '#507299').replaceAll(col.toUpperCase(), '#507299');
        }
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
        .replaceAll('#303236', '#40668F');

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
