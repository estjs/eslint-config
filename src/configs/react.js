import { GLOB_JSX, GLOB_TSX } from '../globs';
import { pluginReact, pluginReactHooks } from '../plugins';

const files = [GLOB_JSX, GLOB_TSX];
export function react(overrides = {}) {
  return [
    {
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
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
        // recommended rules react-hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        'react/display-name': 'error',

        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/require-render-return': 'error',

        'react/jsx-key': 'error',
        'react/jsx-no-comment-textnodes': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-target-blank': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/jsx-no-undef': 'off',
        'react/prop-type': 'off',

        ...overrides,
      },
    },
  ];
}
