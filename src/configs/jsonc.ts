import type { Linter } from 'eslint';
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';
import { parserJsonc, pluginJsonc } from '../plugins';
import type { FlatConfig } from '../types';

const recommendedRules =
  (pluginJsonc.configs['recommended-with-jsonc'] as { rules?: Linter.RulesRecord }).rules ?? {};

export const jsonc: FlatConfig[] = [
  {
    name: 'estjs/jsonc/rules',
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    languageOptions: {
      parser: parserJsonc,
    },
    plugins: {
      jsonc: pluginJsonc,
    },
    rules: {
      ...recommendedRules,
      'jsonc/quote-props': 'off',
      'jsonc/quotes': 'off',
    },
  },
];
