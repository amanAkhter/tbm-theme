// scripts/build-file-icons.mjs
// Compiles file-map.json and recolored SVGs into icons/files/*.svg and icons/file-icon-theme.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Standard location of Material Icon Theme in Antigravity/VS Code extensions
const sourceIconsDir = path.join(
  process.env.HOME,
  '.antigravity',
  'extensions',
  'pkief.material-icon-theme-5.38.1',
  'icons'
);

function recolorSvg(svgContent, tintType) {
  // Parse colors and replace with carbonline palette tones
  let recolored = svgContent;

  if (tintType === 'accent') {
    // Primary accent tint: #00d2b4
    // Secondary carbon gray: #9aa4b2
    recolored = recolored
      .replace(/fill="([^"]+)"/g, (match, color) => {
        if (color === 'none') return match;
        return 'fill="#00d2b4"';
      })
      .replace(/stroke="([^"]+)"/g, (match, color) => {
        if (color === 'none') return match;
        return 'stroke="#00d2b4"';
      });
  } else if (tintType === 'carbon-folder') {
    // Folders: quiet carbon tones
    recolored = recolored
      .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="#717d8e"')
      .replace(/stroke="#[0-9a-fA-F]{3,8}"/g, 'stroke="#545e6d"');
  } else {
    // General carbon file icons: calm gray (#9aa4b2)
    recolored = recolored
      .replace(/fill="([^"]+)"/g, (match, color) => {
        if (color === 'none') return match;
        return 'fill="#9aa4b2"';
      })
      .replace(/stroke="([^"]+)"/g, (match, color) => {
        if (color === 'none') return match;
        return 'stroke="#9aa4b2"';
      });
  }

  return recolored;
}

export function buildFileIcons() {
  const fileMapPath = path.join(rootDir, 'src', 'icons', 'file-map.json');
  const outputFilesDir = path.join(rootDir, 'icons', 'files');
  const outputThemePath = path.join(rootDir, 'icons', 'file-icon-theme.json');

  if (!fs.existsSync(fileMapPath)) {
    throw new Error('file-map.json not found');
  }

  if (!fs.existsSync(sourceIconsDir)) {
    throw new Error(`Material Icon source directory not found: ${sourceIconsDir}`);
  }

  const fileMap = JSON.parse(fs.readFileSync(fileMapPath, 'utf8'));
  fs.mkdirSync(outputFilesDir, { recursive: true });

  const iconDefinitions = {};

  for (const [defKey, config] of Object.entries(fileMap.definitions)) {
    const srcSvgPath = path.join(sourceIconsDir, config.source);
    if (!fs.existsSync(srcSvgPath)) {
      console.warn(`[build-file-icons] Warning: Source SVG not found: ${srcSvgPath}`);
      continue;
    }

    const rawSvg = fs.readFileSync(srcSvgPath, 'utf8');
    const processedSvg = recolorSvg(rawSvg, config.tint);

    const outFileName = `${defKey}.svg`;
    const outFilePath = path.join(outputFilesDir, outFileName);
    fs.writeFileSync(outFilePath, processedSvg, 'utf8');

    iconDefinitions[defKey] = {
      iconPath: `./files/${outFileName}`
    };
  }

  const totalDefinitions = Object.keys(iconDefinitions).length;
  console.log(`[build-file-icons] Generated ${totalDefinitions} icon definitions (Cap: ~150).`);

  const fileIconTheme = {
    $schema: 'vscode://schemas/icon-theme',
    iconDefinitions,
    file: '_file',
    folder: '_folder',
    folderExpanded: '_folder_open',
    rootFolder: '_folder_root',
    rootFolderExpanded: '_folder_root_open',
    fileExtensions: fileMap.fileExtensions || {},
    fileNames: fileMap.fileNames || {},
    folderNames: fileMap.folderNames || {},
    folderNamesExpanded: fileMap.folderNamesExpanded || {}
  };

  fs.writeFileSync(outputThemePath, JSON.stringify(fileIconTheme, null, 2) + '\n', 'utf8');
  console.log(`[build-file-icons] Written file icon theme: ${outputThemePath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildFileIcons();
}
