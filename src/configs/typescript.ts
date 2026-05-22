import type { Linter } from 'eslint';
import { GLOB_JS, GLOB_TS, GLOB_TSX } from '../globs';
import { parserTypeScript, pluginTypeScript } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, TypeScriptRulesOverride } from '../types';
import { restrictedSyntaxJs } from './javascript';

export interface TypeScriptOptions {
  rules?: TypeScriptRulesOverride;
  globals?: Linter.Globals;
}

const eslintRecommendedRules = (pluginTypeScript.configs['eslint-recommended'].overrides?.[0]
  ?.rules ?? {}) as Linter.RulesRecord;
const strictRules = (pluginTypeScript.configs.strict.rules ?? {}) as Linter.RulesRecord;

export const typescriptBaseRules: Linter.RulesRecord = {
  ...eslintRecommendedRules,
  ...strictRules,

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
  '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
    },
  ],

  '@typescript-eslint/no-dynamic-delete': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-unsafe-function-type': 'off',
  '@typescript-eslint/no-unnecessary-type-constraint': 'off',
  '@typescript-eslint/prefer-as-const': 'warn',
  '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],

  'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
  'no-unused-expressions': 'off',
};

export function typescript(options: TypeScriptOptions = {}): FlatConfig[] {
  const { globals: userGlobals = {} } = options;
  const userRules = normalizeRules(options.rules, '@typescript-eslint');

  return [
    {
      name: 'estjs/typescript/rules',
      files: [GLOB_TS, GLOB_TSX],
      languageOptions: {
        parser: parserTypeScript,
        parserOptions: { sourceType: 'module' },
        globals: userGlobals,
      },
      plugins: {
        '@typescript-eslint': pluginTypeScript,
      },
      rules: {
        ...typescriptBaseRules,
        ...userRules,
      },
    },
    {
      name: 'estjs/typescript/dts',
      files: ['**/*.d.ts'],
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'unused-imports/no-unused-vars': 'off',
        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
        ...userRules,
      },
    },
    {
      name: 'estjs/typescript/tests',
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      name: 'estjs/typescript/js',
      files: [GLOB_JS, '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ];
}
