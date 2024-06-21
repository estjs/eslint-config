import { GLOB_JS, GLOB_TS, GLOB_TSX } from '../globs';
import { parserTypeScript, pluginTypeScript } from '../plugins';
import { restrictedSyntaxJs } from './javascript';

export function typescript(overrides = {}) {
  return [
    {
      files: [GLOB_TS, GLOB_TSX],
      languageOptions: {
        parser: parserTypeScript,
        parserOptions: {
          sourceType: 'module',
        },
      },
      plugins: {
        '@typescript-eslint': pluginTypeScript,
      },
      rules: {
        ...pluginTypeScript.configs['eslint-recommended'].overrides[0].rules,
        ...pluginTypeScript.configs.strict.rules,

        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redeclare': 'error',

        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',

        '@typescript-eslint/prefer-as-const': 'warn',
        '@typescript-eslint/prefer-literal-enum-member': [
          'error',
          { allowBitwiseExpressions: true },
        ],

        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],

        ...overrides,
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'unused-imports/no-unused-vars': 'off',
        ...overrides,
      },
    },
    {
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: [GLOB_JS, '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
      },
    },
  ];
}
