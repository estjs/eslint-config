// typescript
import * as _pluginTypeScript from '@typescript-eslint/eslint-plugin';

// react
import _pluginReact from 'eslint-plugin-react';
import * as _pluginUnicorn from 'eslint-plugin-unicorn';
import _pluginReactHooks from 'eslint-plugin-react-hooks';
// vue
import * as _pluginVue from 'eslint-plugin-vue';

// prettier
import * as _pluginPrettier from 'eslint-plugin-prettier';
import * as _configPrettier from 'eslint-config-prettier';

// oxlint
import * as _pluginOxlint from 'eslint-plugin-oxlint';

// others
import * as _pluginUnocss from '@unocss/eslint-plugin';
import _pluginVitest from '@vitest/eslint-plugin';
import * as _pluginNode from 'eslint-plugin-n';
import * as _regexpPlugin from 'eslint-plugin-regexp';
import _pluginUnusedImports from 'eslint-plugin-unused-imports';
import * as _pluginComments from 'eslint-plugin-eslint-comments';
import _jsDocPlugin from 'eslint-plugin-jsdoc';
import * as _pluginMarkdown from '@eslint/markdown';
import * as _pluginPnpm from 'eslint-plugin-pnpm';
export * as parserTypeScript from '@typescript-eslint/parser';
export * as parserVue from 'vue-eslint-parser';
export * as pluginImport from 'eslint-plugin-import-x';
export * as pluginJsonc from 'eslint-plugin-jsonc';
export * as pluginYml from 'eslint-plugin-yml';
export * as pluginSortKeys from 'eslint-plugin-sort-keys';
export * as parserYml from 'yaml-eslint-parser';
export * as parserJsonc from 'jsonc-eslint-parser';
function interopDefault(m) {
  return m.default || m;
}

// react
export const pluginReact = interopDefault(_pluginReact);
export const pluginReactHooks = interopDefault(_pluginReactHooks);

// vue
export const pluginVue = interopDefault(_pluginVue);

// prettier
export const pluginPrettier = interopDefault(_pluginPrettier);
export const configPrettier = interopDefault(_configPrettier);

// oxlint
export const pluginOxlint = interopDefault(_pluginOxlint);

// others
export const pluginUnusedImports = interopDefault(_pluginUnusedImports);
export const pluginComments = interopDefault(_pluginComments);
export const pluginMarkdown = interopDefault(_pluginMarkdown);
export const pluginTypeScript = interopDefault(_pluginTypeScript);
export const pluginUnicorn = interopDefault(_pluginUnicorn);
export const jsDocPlugin = interopDefault(_jsDocPlugin);
export const pluginNode = interopDefault(_pluginNode);
export const pluginVitest = interopDefault(_pluginVitest);
export const pluginRegexp = interopDefault(_regexpPlugin);
export const pluginUnocss = interopDefault(_pluginUnocss);
export const pluginPnpm = interopDefault(_pluginPnpm);
