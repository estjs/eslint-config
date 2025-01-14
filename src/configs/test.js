import { GLOB_TESTS } from '../globs';
import { pluginVitest } from '../plugins';

export function test(overrides = {}) {
  return [
    {
      plugins: {
        test: {
          ...pluginVitest,
          _rules: {
            ...pluginVitest.configs.recommended.rules,
          },
        },
      },
    },
    {
      files: GLOB_TESTS,
      rules: {
        'node/prefer-global/process': 'off',

        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ];
}
