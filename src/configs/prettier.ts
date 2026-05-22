import type { Linter } from 'eslint';
import type { Options as PrettierOptions } from 'prettier';
import { GLOB_ALL } from '../globs';
import { pluginPrettier, prettierDisableRules } from '../plugins';
import type { FlatConfig } from '../types';

const DEFAULTS: PrettierOptions = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  arrowParens: 'always',
  bracketSpacing: true,
  trailingComma: 'all',
  rangeStart: 0,
  rangeEnd: Number.POSITIVE_INFINITY,
  requirePragma: false,
  insertPragma: false,
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'auto',
  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false,
  bracketSameLine: false,
};

const disableConflictingRules: Linter.RulesRecord = {
  ...prettierDisableRules.rules,
  'vue/html-self-closing': 'off',
};

export function prettier(options: PrettierOptions = {}): FlatConfig[] {
  return [
    {
      name: 'estjs/prettier/rules',
      files: [GLOB_ALL],
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        ...disableConflictingRules,
        'prettier/prettier': ['warn', { ...DEFAULTS, ...options }],
      },
    },
  ];
}
