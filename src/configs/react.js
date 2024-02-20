import { isPackageExists } from 'local-pkg';
import { GLOB_JSX, GLOB_TSX } from '../globs';
import { pluginReact, pluginReactHooks, pluginReactRefresh } from '../plugins';

// react refresh
const ReactRefreshAllowConstantExportPackages = ['vite'];
const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i));
const files = [GLOB_JSX, GLOB_TSX];
export const react = [
  {
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
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

      // react refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: isAllowConstantExport },
      ],

      // recommended rules react
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
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
      'react/prop-types': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',

      'react/jsx-no-undef': 'off',
      'react/prop-type': 'off',
    },
  },
];
