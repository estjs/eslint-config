import process from 'node:process';
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

export function getVueVersion() {
  const pkg = getPackageInfoSync('vue', { paths: [process.cwd()] });
  if (pkg && typeof pkg.version === 'string' && !Number.isNaN(+pkg.version[0])) {
    return +pkg.version[0];
  }
  return 3;
}
export const isVue3 = getVueVersion() === 3;
