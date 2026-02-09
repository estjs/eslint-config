import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';
import { parserJsonc, pluginJsonc } from '../plugins';

export const jsonc = [
  {
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    languageOptions: {
      parser: parserJsonc,
    },
    plugins: {
      jsonc: pluginJsonc,
    },
    rules: {
      ...pluginJsonc.configs['recommended-with-jsonc'].rules,
      'jsonc/quote-props': 'off',
      'jsonc/quotes': 'off',
    },
  },
];
