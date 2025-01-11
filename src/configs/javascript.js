import globals from 'globals';
import { pluginUnusedImports } from '../plugins';

export const restrictedSyntaxJs = ['LabeledStatement', 'WithStatement'];

export function javascript(overrides = {}, global = {}) {
  return [
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          ...global,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      plugins: {
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'dot-notation': 'warn',
        eqeqeq: ['error', 'smart'],
        'no-alert': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-constant-condition': 'warn',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multi-str': 'error',
        'no-octal': 'error',
        'no-prototype-builtins': 'error',
        'no-regex-spaces': 'error',
        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
        'no-return-await': 'warn',
        'no-self-assign': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-undef': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unsafe-optional-chaining': 'error',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'unused-imports/no-unused-imports': 'warn',
        'unused-imports/no-unused-vars': [
          'error',
          { args: 'after-used', ignoreRestSiblings: true },
        ],
        'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'vars-on-top': 'error',
        'wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],

        // off rules
        'no-void': 'off',
        'no-unused-vars': 'off',
        'no-lonely-if': 'off',
        ...overrides,
      },
    },
    {
      files: ['**/scripts/*', '**/cli.*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.{test,spec}.js?(x)'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ];
}
