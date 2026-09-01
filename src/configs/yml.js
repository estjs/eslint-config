import { GLOB_YAML } from '../globs';
import { parserYml, pluginYml } from '../plugins';

const pluginYmlConfig = pluginYml.configs.standard;
const pluginYmlPrettierConfig = pluginYml.configs.prettier;

const ymlStandardRules = (Array.isArray(pluginYmlConfig) ? pluginYmlConfig : [pluginYmlConfig])
  .map((c) => c.rules)
  .reduce((acc, rules) => ({ ...acc, ...rules }), {});

const ymlPrettierRules = (
  Array.isArray(pluginYmlPrettierConfig) ? pluginYmlPrettierConfig : [pluginYmlPrettierConfig]
)
  .map((c) => c.rules)
  .reduce((acc, rules) => ({ ...acc, ...rules }), {});

export const yml = [
  {
    files: [GLOB_YAML],
    languageOptions: {
      parser: parserYml,
    },
    plugins: {
      yml: pluginYml,
    },
    rules: {
      ...ymlStandardRules,
      ...ymlPrettierRules,
      'yml/no-empty-mapping-value': 'off',
    },
  },
];
