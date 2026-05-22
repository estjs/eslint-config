import type { Linter } from 'eslint';
import { pluginRegexp } from '../plugins';
import { downgradeErrorsToWarn, normalizeRules } from '../shared';
import type { FlatConfig, RegexpRulesOverride } from '../types';

export interface RegexpOptions {
  rules?: RegexpRulesOverride;
}

const recommendedRules =
  (pluginRegexp.configs['flat/recommended'].rules ?? {}) as Linter.RulesRecord;

export function regexp(options: RegexpOptions = {}): FlatConfig[] {
  const userRules = normalizeRules(options.rules, 'regexp');

  return [
    {
      name: 'estjs/regexp/rules',
      plugins: {
        regexp: pluginRegexp,
      },
      rules: {
        ...downgradeErrorsToWarn(recommendedRules),
        ...userRules,
      },
    },
  ];
}
