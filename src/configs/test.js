import { GLOB_TESTS } from '../globs';
import { pluginVitest } from '../plugins';

export function test(overrides = {}) {
  return [
    {
      plugins: {
        vitest: pluginVitest,
      },
    },
    {
      files: GLOB_TESTS,
      rules: {
        ...pluginVitest.configs.recommended.rules,
        'node/prefer-global/process': 'off',
        'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'vitest/no-identical-title': 'error',
        'vitest/no-import-node-test': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ];
}
