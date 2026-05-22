// Centralised plugin / parser imports. Each upstream re-exports inconsistently, so we use
// `interopDefault` to normalise. Plugin instances intentionally widen to `any`: upstream
// types frequently disagree with the official `Linter.Plugin` shape, and forcing them
// through would mean cascading casts at every call site. The same applies to parsers and
// pre-built config factories from upstream packages.
//
// Naming convention:
//   pluginX            — ESLint plugin instances
//   parserX            — Parser instances
//   commandConfig      — Factory function from upstream
//   prettierDisableRules — Pre-built rule disable set from `eslint-config-prettier`

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as eslintCommentsRaw from '@eslint-community/eslint-plugin-eslint-comments';
import * as eslintReactRaw from '@eslint-react/eslint-plugin';
import * as markdownRaw from '@eslint/markdown';
import * as typescriptPluginRaw from '@typescript-eslint/eslint-plugin';
import * as typescriptParserRaw from '@typescript-eslint/parser';
import * as unocssRaw from '@unocss/eslint-plugin';
import vitestRaw from '@vitest/eslint-plugin';
import prettierDisableRaw from 'eslint-config-prettier';
import commandConfigRaw from 'eslint-plugin-command/config';
import * as importRaw from 'eslint-plugin-import-x';
import jsdocRaw from 'eslint-plugin-jsdoc';
import * as jsoncRaw from 'eslint-plugin-jsonc';
import * as nodeRaw from 'eslint-plugin-n';
import * as pnpmRaw from 'eslint-plugin-pnpm';
import * as prettierRaw from 'eslint-plugin-prettier';
import * as regexpRaw from 'eslint-plugin-regexp';
import * as sortKeysRaw from 'eslint-plugin-sort-keys';
import * as unicornRaw from 'eslint-plugin-unicorn';
import unusedImportsRaw from 'eslint-plugin-unused-imports';
import * as vueRaw from 'eslint-plugin-vue';
import * as ymlRaw from 'eslint-plugin-yml';
import * as jsoncParserRaw from 'jsonc-eslint-parser';
import * as vueParserRaw from 'vue-eslint-parser';
import * as ymlParserRaw from 'yaml-eslint-parser';
import { interopDefault } from './shared';

// ESLint plugin instances.
export const pluginComments: any = interopDefault(eslintCommentsRaw);
export const pluginImport: any = interopDefault(importRaw);
export const pluginJsdoc: any = interopDefault(jsdocRaw);
export const pluginJsonc: any = interopDefault(jsoncRaw);
export const pluginMarkdown: any = interopDefault(markdownRaw);
export const pluginNode: any = interopDefault(nodeRaw);
export const pluginPnpm: any = interopDefault(pnpmRaw);
export const pluginPrettier: any = interopDefault(prettierRaw);
export const pluginReact: any = interopDefault(eslintReactRaw);
export const pluginRegexp: any = interopDefault(regexpRaw);
export const pluginSortKeys: any = interopDefault(sortKeysRaw);
export const pluginTest: any = interopDefault(vitestRaw);
export const pluginTypeScript: any = interopDefault(typescriptPluginRaw);
export const pluginUnicorn: any = interopDefault(unicornRaw);
export const pluginUnocss: any = interopDefault(unocssRaw);
export const pluginUnusedImports: any = interopDefault(unusedImportsRaw);
export const pluginVue: any = interopDefault(vueRaw);
export const pluginYml: any = interopDefault(ymlRaw);

// Parsers.
export const parserJsonc: any = interopDefault(jsoncParserRaw);
export const parserTypeScript: any = interopDefault(typescriptParserRaw);
export const parserVue: any = interopDefault(vueParserRaw);
export const parserYml: any = interopDefault(ymlParserRaw);

// Upstream-provided rule sets / factories.
export const prettierDisableRules: any = interopDefault(prettierDisableRaw);
/** Factory that returns a ready-made `eslint-plugin-command` flat-config entry. */
export const commandConfig: any = interopDefault(commandConfigRaw);
