import {
  command,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  pnpm,
  prettier,
  react,
  regexp,
  sortKeys,
  sortPackageJson,
  sortTsconfig,
  test,
  typescript,
  unicorn,
  unocss,
  vue,
  yml,
} from './configs';
import { hasReact, hasTest, hasTypeScript, hasUnocss, hasVue } from './env';
import type { FlatConfig, Options } from './types';

/**
 * Resolve feature toggle: `undefined` falls back to the default; `true`/`false` overrides.
 */
function resolveToggle(value: boolean | undefined, fallback: boolean): boolean {
  return value ?? fallback;
}

/**
 * Build a flat ESLint config from a single options object.
 *
 * Auto-detected from installed dependencies (override via the matching key):
 *   - `typescript` — toggled by the presence of `typescript`
 *   - `react` — toggled by the presence of `react`
 *   - `vue` — toggled by `vue`/`nuxt`/`vitepress`/`@slidev/cli`
 *   - `test` — toggled by `vitest`/`jest`
 *   - `unocss` — toggled by `unocss`/`@unocss/webpack`/`@unocss/nuxt`
 *
 * Enabled by default (pass `false` to disable): `node`, `markdown`, `prettier`, `regexp`.
 * Disabled by default (pass `true` to enable): `pnpm`.
 *
 * @example
 * ```ts
 * import { defineConfig } from '@estjs/eslint-config';
 *
 * export default defineConfig({
 *   typescript: true,
 *   vue: true,
 *   prettier: { semi: false },
 *   ignores: ['**\/dist/**'],
 *   rules: {
 *     javascript: { 'no-console': 'off' },
 *     typescript: { 'no-unused-vars': 'off' },
 *   },
 * });
 * ```
 */
export function defineConfig(options: Options = {}): FlatConfig[] {
  const rules = options.rules ?? {};
  const globalsOverride = options.globals ?? {};

  const enabled = {
    typescript: resolveToggle(options.typescript, Boolean(hasTypeScript)),
    react: resolveToggle(options.react, Boolean(hasReact)),
    vue: resolveToggle(options.vue, Boolean(hasVue)),
    test: resolveToggle(options.test, Boolean(hasTest)),
    unocss: resolveToggle(options.unocss, Boolean(hasUnocss)),
    node: resolveToggle(options.node, true),
    markdown: resolveToggle(options.markdown, true),
    regexp: resolveToggle(options.regexp, true),
    pnpm: resolveToggle(options.pnpm, false),
  };

  const prettierEnabled = options.prettier !== false;
  const prettierOptions = typeof options.prettier === 'object' ? options.prettier : {};

  const configs: FlatConfig[] = [
    ...ignores({ ignores: options.ignores ?? [] }),
    ...javascript({ rules: rules.javascript, globals: globalsOverride }),
    ...comments({ rules: rules.comments }),
    ...imports({ rules: rules.imports }),
    ...unicorn({ rules: rules.unicorn }),
    ...jsdoc({ rules: rules.jsdoc }),
    ...sortKeys,
    ...jsonc,
    ...sortPackageJson,
    ...sortTsconfig,
    ...yml,
    ...command({ rules: rules.command }),
  ];

  if (enabled.pnpm) configs.push(...pnpm({ rules: rules.pnpm }));
  if (prettierEnabled) configs.push(...prettier(prettierOptions));
  if (enabled.vue) {
    configs.push(...vue({ rules: rules.vue, typescript: enabled.typescript }));
  }
  if (enabled.markdown) configs.push(...markdown({ rules: rules.markdown }));
  if (enabled.unocss) configs.push(...unocss());
  if (enabled.react) configs.push(...react({ rules: rules.react }));
  if (enabled.typescript) {
    configs.push(...typescript({ rules: rules.typescript, globals: globalsOverride }));
  }
  if (enabled.test) configs.push(...test({ rules: rules.test }));
  if (enabled.node) configs.push(...node);
  if (enabled.regexp) configs.push(...regexp({ rules: rules.regexp }));

  return configs;
}
