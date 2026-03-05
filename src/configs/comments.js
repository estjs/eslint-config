import { pluginComments } from '../plugins';

export const comments = function (overrides = {}) {
  return [
    {
      plugins: {
        '@eslint-community/eslint-comments': pluginComments,
      },
      rules: {
        ...pluginComments.configs.recommended.rules,
        '@eslint-community/eslint-comments/disable-enable-pair': [
          'error',
          { allowWholeFile: true },
        ],
        ...overrides,
      },
    },
  ];
};
