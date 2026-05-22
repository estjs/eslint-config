import process from 'node:process';
import { getPackageInfoSync, isPackageExists } from 'local-pkg';

/** True if `react` is installed in the consumer project. */
export const hasReact = isPackageExists('react');

/** True if `typescript` is installed in the consumer project. */
export const hasTypeScript = isPackageExists('typescript');

/** True if `vitest` or `jest` is installed. */
export const hasTest = isPackageExists('jest') || isPackageExists('vitest');

/** True if any Vue-flavored framework is installed. */
export const hasVue =
  isPackageExists('vue') ||
  isPackageExists('nuxt') ||
  isPackageExists('vitepress') ||
  isPackageExists('@slidev/cli');

/** True if UnoCSS or any of its loaders is installed. */
export const hasUnocss =
  isPackageExists('unocss') || isPackageExists('@unocss/webpack') || isPackageExists('@unocss/nuxt');

/**
 * Inspect the installed `vue` package and return its major version. Falls back to `3` when
 * the version cannot be parsed.
 */
export function getVueMajor(): 2 | 3 {
  const pkg = getPackageInfoSync('vue', { paths: [process.cwd()] });
  if (pkg && typeof pkg.version === 'string') {
    const major = Number.parseInt(pkg.version, 10);
    if (major === 2) return 2;
  }
  return 3;
}

/** True if the installed Vue is v3. */
export const isVue3 = getVueMajor() === 3;
