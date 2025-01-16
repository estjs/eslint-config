import { GLOB_JSX, GLOB_TSX } from '../globs';
import { pluginReact } from '../plugins';

const files = [GLOB_JSX, GLOB_TSX];
export function react(overrides = {}) {
  return [
    {
      plugins: {
        react: pluginReact,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      rules: {
        'react/display-name': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',

        'react/no-unescaped-entities': 'warn',
        'react/no-unknown-property': 'warn',
        'react-hooks/exhaustive-deps': 'warn',

        'react/require-render-return': 'error',

        'react/no-unsafe': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        ...overrides,
      },
    },
  ];
}
