const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..');
const destDir = path.resolve(srcDir, 'www');

// List of folders and files to copy
const assetsToCopy = [
  { type: 'file', name: 'index.html' },
  { type: 'file', name: 'manifest.json' },
  { type: 'file', name: 'sw.js' },
  { type: 'dir', name: 'css' },
  { type: 'dir', name: 'js' },
  { type: 'dir', name: 'icons' }
];

// Helper to delete a folder recursively
function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

// Helper to copy a file
function copyFileSync(source, target) {
  let targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Helper to copy a folder recursively
function copyFolderRecursiveSync(source, target) {
  let files = [];
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

function main() {
  console.log('--- INSAT-Sim Assets Packager ---');
  
  // 1. Clean destination
  if (fs.existsSync(destDir)) {
    console.log('Cleaning old build folder: www/');
    deleteFolderRecursive(destDir);
  }
  
  // 2. Create destination
  fs.mkdirSync(destDir);
  console.log('Created fresh folder: www/');

  // 3. Copy production assets
  assetsToCopy.forEach((asset) => {
    const srcPath = path.join(srcDir, asset.name);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARNING] Source path does not exist: ${srcPath}`);
      return;
    }
    
    if (asset.type === 'file') {
      console.log(`Copying file: ${asset.name}`);
      copyFileSync(srcPath, path.join(destDir, asset.name));
    } else if (asset.type === 'dir') {
      console.log(`Copying folder: ${asset.name}/`);
      copyFolderRecursiveSync(srcPath, destDir);
    }
  });

  console.log('Build completed successfully. All offline assets are packaged in: www/');
}

main();
