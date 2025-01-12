#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import process from 'process';
import { fileURLToPath } from 'url';

// Get the current working directory and library directory
const currentDir = process.cwd();
const libraryDir = path.dirname(fileURLToPath(import.meta.url));

// Check if biome.json exists in the current directory
// let biomeConfigPath = path.join(currentDir, "biome.json");
// if (!fs.existsSync(biomeConfigPath)) {
// 	// If not, use the biome.json from the library directory
// 	biomeConfigPath = path.join(libraryDir, "biome.json");
// }

const eslintConfigFiles = fs
  .readdirSync(currentDir)
  .filter(file => file.startsWith('eslint.config'));

// If multiple config files are found, default to the first one
let eslintConfigPath;
if (eslintConfigFiles.length > 0) {
  eslintConfigPath = path.join(currentDir, eslintConfigFiles[0]);
} else {
  eslintConfigPath = path.join(libraryDir, 'defaultConfig.js');
}

// Dynamically import the ESLint configuration
const { default: eslintConfig } = await import(eslintConfigPath);
// const biomeConfig = fs.readFileSync(biomeConfigPath);

// const biomeConfigParser = JSON.parse(biomeConfig);
// Read the ignore settings from the ESLint config file and add them to the biome config
const ignores = eslintConfig.find(item => item.ignores)?.ignores || [];

// Read the biome configuration from the ESLint config
const eslintBiomeConfig =
  eslintConfig.find(item => item?.plugins?.biome)?.rules?.['biome/biome']?.[1] || {};

// ...biomeConfigParser,
const mergedBiomeConfig = { ...eslintBiomeConfig };

if (!mergedBiomeConfig.files) {
  mergedBiomeConfig.files = {};
}
if (!mergedBiomeConfig.files.ignore) {
  mergedBiomeConfig.files.ignore = [];
}
mergedBiomeConfig.files.ignore = [...mergedBiomeConfig.files.ignore, ...ignores];

const generateFilePath = path.join(libraryDir, 'biome.json');
// Generate a temporary file
fs.writeFileSync(generateFilePath, JSON.stringify(mergedBiomeConfig), 'utf-8');

// Get the paths for biome and eslint
const biomePath = path.join(currentDir, 'node_modules', '.bin', 'biome');
const eslintPath = path.join(currentDir, 'node_modules', '.bin', 'eslint');

// Parse command line arguments
const args = process.argv.slice(2).join(' ');

// Function to beautify output
function logMessage(message) {
  console.log(`\n========= ${message} =========\n`);
}

// Run the biomejs bin command to format code
try {
  logMessage('Running Biome');

  // Pass arguments to biome
  execSync(`${biomePath} check --write --config-path ${generateFilePath}`, {
    stdio: 'inherit',
  });
} catch {
  // do nothing
}

// Run eslint to format code
try {
  logMessage('Running ESLint');
  execSync(`${eslintPath} ${args}`, {
    stdio: 'inherit',
  });
} catch {
  // do nothing
}

// fs.unlinkSync(generateFilePath);
logMessage('Formatting Complete');
process.exit(0);
