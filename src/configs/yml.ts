import type { Linter } from 'eslint';
import { GLOB_YAML } from '../globs';
import { parserYml, pluginYml } from '../plugins';
import type { FlatConfig } from '../types';

const standardRules = (pluginYml.configs.standard as { rules?: Linter.RulesRecord }).rules ?? {};
const prettierRules = (pluginYml.configs.prettier as { rules?: Linter.RulesRecord }).rules ?? {};

export const yml: FlatConfig[] = [
  {
    name: 'estjs/yml/rules',
    files: [GLOB_YAML],
    languageOptions: {
      parser: parserYml,
    },
    plugins: {
      yml: pluginYml,
    },
    rules: {
      ...standardRules,
      ...prettierRules,
      'yml/no-empty-mapping-value': 'off',
    },
  },
];
