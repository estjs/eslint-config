import process from 'node:process';
import { GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';
import { parserTypeScript, pluginTypeScript } from '../plugins';
import { restrictedSyntaxJs } from './javascript';

export function typescript(options = {}, globals = {}) {
  const {
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    tsconfigPath,
    files = [GLOB_TS, GLOB_TSX],
    filesTypeAware = [GLOB_TS, GLOB_TSX],
    ignoresTypeAware = [`${GLOB_MARKDOWN}/**`],
  } = typeof options === 'object' && !Array.isArray(options) && options !== null ? options : {};

  const isTypeAware = Boolean(tsconfigPath);

  const typeAwareRules = {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/unbound-method': 'error',
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'require-await': 'off',
  };

  function makeParser(typeAware, filesList, ignoresList) {
    return {
      files: filesList,
      ...(ignoresList ? { ignores: ignoresList } : {}),
      languageOptions: {
        parser: parserTypeScript,
        parserOptions: {
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...parserOptions,
        },
        globals,
      },
    };
  }

  return [
    makeParser(false, files),
    ...(isTypeAware ? [makeParser(true, filesTypeAware, ignoresTypeAware)] : []),

    {
      files,
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
        '@typescript-eslint/prefer-literal-enum-member': [
          'error',
          { allowBitwiseExpressions: true },
        ],

        'no-restricted-syntax': ['error', ...restrictedSyntaxJs],
        'no-unused-expressions': 'off',
        'no-redeclare': 'off',
        'no-dupe-class-members': 'off',

        ...overrides,
      },
    },

    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            rules: {
              ...typeAwareRules,
              ...overridesTypeAware,
            },
          },
        ]
      : []),
  ];
}
