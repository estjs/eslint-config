import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from '../globs';

export function disables(options = {}) {
  const {
    scripts: scriptsOverrides = {},
    dts: dtsOverrides = {},
    config: configOverrides = {},
    test: testOverrides = {},
    cjs: cjsOverrides = {},
    overrides = {},
  } = options;

  return [
    {
      name: 'estjs/disables/scripts',
      files: [`**/scripts/**/${GLOB_SRC}`, '**/scripts/*', '**/cli.*', '**/cli/*'],
      rules: {
        'no-console': 'off',
        'node/prefer-global/process': 'off',
        ...scriptsOverrides,
        ...overrides,
      },
    },
    {
      name: 'estjs/disables/dts',
      files: ['**/*.d.ts', '**/*.d.?([cm])ts'],
      rules: {
        '@eslint-community/eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
        ...dtsOverrides,
        ...overrides,
      },
    },
    {
      name: 'estjs/disables/config-files',
      files: [
        `**/*config*.${GLOB_SRC_EXT}`,
        `**/*.config.*`,
        '**/.prettierrc*',
        `**/views/${GLOB_SRC}`,
        `**/pages/${GLOB_SRC}`,
        '**/{index,vite,esbuild,rollup,webpack,rspack}.ts',
        `${GLOB_MARKDOWN}/**`,
      ],
      rules: {
        'import/no-default-export': 'off',
        'no-console': 'off',
        ...configOverrides,
        ...overrides,
      },
    },
    {
      name: 'estjs/disables/tests',
      files: ['**/*.{test,spec}.?([cm])[jt]s?(x)', '**/__tests__/**'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        'no-unused-expressions': 'off',
        'node/prefer-global/process': 'off',
        ...testOverrides,
        ...overrides,
      },
    },
    {
      name: 'estjs/disables/cjs',
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        ...cjsOverrides,
        ...overrides,
      },
    },
  ];
}
