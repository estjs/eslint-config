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
        curly: 'off',
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'constructor-super': 'error',
        'dot-notation': 'warn',
        eqeqeq: 'off',
        'for-direction': 'error',
        'getter-return': 'off',
        'no-alert': 'warn',
        'no-async-promise-executor': 'off',
        'no-case-declarations': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-console': 'off',
        'no-const-assign': 'off',
        'no-constant-condition': 'off',
        'no-control-regex': 'error',
        'no-debugger': 'off',
        'no-delete-var': 'error',
        'no-dupe-args': 'off',
        'no-dupe-class-members': 'off',
        'no-dupe-else-if': 'error',
        'no-dupe-keys': 'off',
        'no-duplicate-case': 'off',
        'no-empty': 'off',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'off',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'off',
        'no-fallthrough': ['warn', { commentPattern: 'break[\\s\\w]*omitted' }],
        'no-func-assign': 'off',
        'no-global-assign': 'off',
        'no-import-assign': 'error',
        'no-inner-declarations': 'off',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',

        'no-loss-of-precision': 'off',
        'no-misleading-character-class': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multi-str': 'error',
        'no-new-symbol': 'off',
        'no-nonoctal-decimal-escape': 'error',
        'no-obj-calls': 'off',
        'no-octal': 'error',
        'no-prototype-builtins': 'error',
        'no-redeclare': 'error',
        'no-regex-spaces': 'error',
        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
        'no-return-await': 'warn',
        'no-self-assign': 'off',
        'no-setter-return': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'off',
        'no-this-before-super': 'error',
        'no-undef': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'off',
        'no-unsafe-finally': 'off',

        'no-unsafe-negation': 'error',
        'no-unsafe-optional-chaining': 'off',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],
        'no-unused-labels': 'off',

        'no-useless-backreference': 'error',
        'no-useless-catch': 'off',
        'no-useless-escape': 'error',
        'no-with': 'off',
        'object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
        'prefer-const': 'off',
        'prefer-exponentiation-operator': 'off',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'off',
        'prefer-spread': 'error',
        'prefer-template': 'off',
        'require-await': 'off',
        'require-yield': 'error',
        'sort-imports': [
          'error',
          {
            allowSeparatedGroups: false,
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],
        'unicode-bom': ['error', 'never'],
        'unused-imports/no-unused-imports': 'warn',
        'unused-imports/no-unused-vars': [
          'error',
          { args: 'after-used', ignoreRestSiblings: true },
        ],
        'use-isnan': 'off',
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'vars-on-top': 'error',
        'wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],

        // off rule
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
