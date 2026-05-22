import { GLOB_TESTS } from '../globs';
import { pluginTest } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, TestRulesOverride } from '../types';

export interface TestOptions {
  files?: string[];
  rules?: TestRulesOverride;
}

export function test(options: TestOptions = {}): FlatConfig[] {
  const { files = GLOB_TESTS } = options;
  const userRules = normalizeRules(options.rules, 'vitest');

  return [
    {
      name: 'estjs/test/setup',
      plugins: {
        vitest: pluginTest,
      },
    },
    {
      name: 'estjs/test/rules',
      files,
      rules: {
        ...pluginTest.configs.recommended.rules,
        'node/prefer-global/process': 'off',
        'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'vitest/no-identical-title': 'error',
        'vitest/no-import-node-test': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-lowercase-title': 'error',
        ...userRules,
      },
    },
  ];
}
