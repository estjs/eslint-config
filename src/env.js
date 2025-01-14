import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPackageInfoSync, isPackageExists } from 'local-pkg';

export const hasReact = isPackageExists('react');
export const hasTypeScript = isPackageExists('typescript');
export const hasTest = isPackageExists('jest') || isPackageExists('vitest');
export const hasVue =
  isPackageExists('vue') ||
  isPackageExists('nuxt') ||
  isPackageExists('vitepress') ||
  isPackageExists('@slidev/cli');
export const hasUnocss =
  isPackageExists('unocss') ||
  isPackageExists('@unocss/webpack') ||
  isPackageExists('@unocss/nuxt');
export const hasTailwindCSS = isPackageExists('tailwindcss');

export function getVueVersion() {
  const pkg = getPackageInfoSync('vue', { paths: [process.cwd()] });
  if (
    pkg &&
    typeof pkg.version === 'string' &&
    !Number.isNaN(+pkg.version[0])
  ) {
    return +pkg.version[0];
  }
  return 3;
}
export const isVue3 = getVueVersion() === 3;

// Get the current working directory and library directory
const currentDir = process.cwd();
const libraryDir = path.dirname(fileURLToPath(import.meta.url));
let biomeConfigPath = path.join(currentDir, 'biome.json');
if (!fs.existsSync(biomeConfigPath)) {
  // If not, use the biome.json from the library directory
  biomeConfigPath = path.join(libraryDir, 'biome.json');
}
export const loadBiomeConfig = JSON.parse(
  fs.readFileSync(biomeConfigPath, 'utf-8'),
);

export const isGlobalFormat =
  process.env.ESTLINT_ESLINT_GLOBAL_FORMAT === 'true';
