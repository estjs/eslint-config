import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';
import { parserJsonc, pluginJsonc } from '../plugins';

const pluginJsoncConfig = pluginJsonc.configs['recommended-with-jsonc'];
const jsoncRecommendedRules = (
  Array.isArray(pluginJsoncConfig) ? pluginJsoncConfig : [pluginJsoncConfig]
)
  .map((c) => c.rules)
  .reduce((acc, rules) => ({ ...acc, ...rules }), {});

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
      ...jsoncRecommendedRules,
      'jsonc/quote-props': 'off',
      'jsonc/quotes': 'off',
    },
  },
];
