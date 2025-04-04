import process from 'node:process';
import { deepmerge } from 'deepmerge-ts';
import {
  biome,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
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
  prettier,
} from './configs';
import { hasReact, hasTest, hasTypeScript, hasUnocss, hasVue, loadBiomeConfig } from './env';
import { runBiomeFormat } from './biome';

/**
 * Generates a list of configurations based on the input parameters.
 *
 * @param {object} param1 - Configuration options for various tools and frameworks.
 * @param {object} param1.typescript - Configuration options for TypeScript.
 * @param {object} param1.javascript - Configuration options for JavaScript.
 * @param {object} param1.imports - Configuration options for imports.
 * @param {object} param1.unicorn - Configuration options for unicorn.
 * @param {object} param1.jsdoc - Configuration options for jsdoc.
 * @param {object} param1.vue - Configuration options for vue.
 * @param {object} param1.markdown - Configuration options for markdown.
 * @param {object} param1.biome - Configuration options for biome.
 * @param {object} param1.prettier - Configuration options for prettier.
 * @param {object} param1.react - Configuration options for react.
 * @param {object} param1.test - Configuration options for test.
 * @param {object} param1.globals - Configuration options for globals.
 * @param {object} param1.ignores - Configuration options for ignores.
 * @param {object} param2 - Additional options to enable or disable certain features.
 * @param {boolean} param2.vue - Enable or disable vue.
 * @param {boolean} param2.test - Enable or disable test.
 * @param {boolean} param2.react - Enable or disable react.
 * @param {boolean} param2.unocss - Enable or disable unocss.
 * @param {boolean} param2.typescript - Enable or disable typescript.
 * @param {boolean} param2.node - Enable or disable node.
 * @param {boolean} param2.markdown - Enable or disable markdown.
 * @param {boolean} param2.biome - Enable or disable biome.
 * @param {boolean} param2.prettier - Enable or disable prettier.
 *
 * @return {Array} List of configurations based on the input parameters.
 */
export function estjs(
  {
    typescript: tsConfig = {},
    javascript: jsConfig = {},
    imports: importsConfig = {},
    unicorn: unicornConfig = {},
    jsdoc: jsdocConfig = {},
    vue: vueConfig = {},
    markdown: markdownConfig = {},
    biome: biomeConfig = {},
    prettier: prettierConfig = {},
    react: reactConfig = {},
    test: testConfig = {},
    globals = {},
    ignores: ignoresConfig = [],
  } = {},
  {
    vue: enableVue = hasVue ?? false,
    test: enableTest = hasTest ?? false,
    react: enableReact = hasReact ?? false,
    unocss: enableUnocss = hasUnocss ?? false,
    typescript: enableTS = hasTypeScript ?? false,
    node: enableNode = true,
    biome: enableBiome = false,
    prettier: enablePrettier = true,
    markdown: enableMarkdown = true,
  } = {},
) {
  const isGlobalFormat = !process.argv.includes('--node-ipc');

  if (enableBiome) {
    const mergedBiomeConfig = deepmerge(loadBiomeConfig, biomeConfig, {
      files: { ignore: ignoresConfig },
      javascript: { globals: Object.keys(globals) },
    });

    if (isGlobalFormat) {
      runBiomeFormat(mergedBiomeConfig);
    }
  }

  const configs = [
    ...ignores(ignoresConfig),
    ...javascript(jsConfig, globals),
    ...comments,
    ...imports(importsConfig),
    ...unicorn(unicornConfig),
    ...jsdoc(jsdocConfig),
    ...sortKeys,
    ...jsonc,
    ...sortPackageJson,
    ...sortTsconfig,
    ...yml,
    ...regexp(),
  ];

  if (!isGlobalFormat && enableBiome) {
    configs.push(...biome(mergedBiomeConfig));
  }

  // if enable biome, using prettier format vue
  if (enablePrettier || enableBiome) {
    configs.push(...prettier(prettierConfig, enableBiome));
  }
  if (enableVue) {
    configs.push(...vue(vueConfig));
  }
  if (enableMarkdown) {
    configs.push(...markdown(markdownConfig));
  }
  if (enableUnocss) {
    configs.push(...unocss);
  }
  if (enableReact) {
    configs.push(...react(reactConfig));
  }
  if (enableTS) {
    configs.push(...typescript(tsConfig, globals));
  }
  if (enableTest) {
    configs.push(...test(testConfig));
  }
  if (enableNode) {
    configs.push(...node);
  }

  return configs;
}
