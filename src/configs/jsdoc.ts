import { pluginJsdoc } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, JSDocRulesOverride } from '../types';

export interface JSDocOptions {
  rules?: JSDocRulesOverride;
}

export function jsdoc(options: JSDocOptions = {}): FlatConfig[] {
  const userRules = normalizeRules(options.rules, 'jsdoc');

  return [
    {
      name: 'estjs/jsdoc/rules',
      plugins: {
        jsdoc: pluginJsdoc,
      },
      rules: {
        'jsdoc/check-access': 'warn',
        'jsdoc/check-param-names': 'warn',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/check-types': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/no-multi-asterisks': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-check': 'warn',
        'jsdoc/require-returns-description': 'warn',
        'jsdoc/require-yields-check': 'warn',
        ...userRules,
      },
    },
  ];
}
