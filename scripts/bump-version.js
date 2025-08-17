const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const versionFilePath = path.join(__dirname, '..', 'src', 'version.ts');
const packageJson = require(packageJsonPath);

// Increment version
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Update version.ts
fs.writeFileSync(versionFilePath, `export const version = '${newVersion}';\n`);

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
