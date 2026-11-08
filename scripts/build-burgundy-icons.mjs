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
      console.warn(`[build-burgundy-icons] Warning: Source icon missing: ${origAbsPath}`);
      continue;
    }

    const svgContent = fs.readFileSync(origAbsPath, 'utf8');

    if (origRelPath.includes('folders/')) {
      const fileName = path.basename(origRelPath);
      let recolored = svgContent;

      if (fileName.includes('_open.svg')) {
        // Open folder: Vibrant Electric Rose accent (#FF7597) - bright glowing accent with luminous pocket
        recolored = recolored
          .replaceAll('#80cbc4', '#FF7597')
          .replaceAll('#80CBC4', '#FF7597')
          .replaceAll('#00b6c2', '#FFA0B4')
          .replaceAll('opacity=".16"', 'opacity=".36"');
      } else {
        // Closed folder: Dimmed Mauve-Wine (#613642) - calm, quiet, recognizable but clearly dimmed
        // 1. Base folder body & pockets
        recolored = recolored
          .replaceAll('#303236', '#613642')
          .replaceAll('#4a616c', '#613642')
          .replaceAll('#343944', '#613642')
          .replaceAll('color(display-p3 .2902 .3804 .4235)', '#613642')
          .replaceAll('opacity=".16"', 'opacity=".12"')
          .replaceAll('opacity=".18"', 'opacity=".12"');

        // 2. Dim all badge and accent colors to calm mid-mauve wine (#8E5767)
        for (const col of closedBadgeColors) {
          recolored = recolored.replaceAll(col, '#8E5767').replaceAll(col.toUpperCase(), '#8E5767');
        }
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

      // Warm slate/cold grey bodies to deep dark titanium wine tones
      recolored = recolored
        .replaceAll('color(display-p3 .42 .4493 .58)', 'color(display-p3 .65 .42 .50)')
        .replaceAll('color(display-p3 .698 .8 .8392)', 'color(display-p3 .75 .60 .68)')
        .replaceAll('color(display-p3 .2039 .2235 .2667)', 'color(display-p3 .18 .06 .09)')
        .replaceAll('color(display-p3 .1469 .1756 .2281)', 'color(display-p3 .10 .03 .05)')
        .replaceAll('#6b7394', '#8A5D66')
        .replaceAll('#b2ccd6', '#C7A2AB')
        .replaceAll('#303236', '#8F5260');

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
