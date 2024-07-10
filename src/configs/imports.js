import { pluginImport } from '../plugins';
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from '../globs';

export function imports(overrides = {}) {
  return [
    {
      plugins: {
        import: pluginImport,
      },
      rules: {
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
            pathGroups: [{ group: 'internal', pattern: '{{@,~}/,#}**' }],
            pathGroupsExcludedImportTypes: ['type'],
          },
        ],

        // off
        'import/no-default-export': 'off',
        'import/no-mutable-exports': 'off',
        ...overrides,
      },
    },
    {
      files: [
        `**/*config*.${GLOB_SRC_EXT}`,
        `**/views/${GLOB_SRC}`,
        `**/pages/${GLOB_SRC}`,
        `**/{index,vite,esbuild,rollup,webpack,rspack}.ts`,
        '**/*.d.ts',
        `${GLOB_MARKDOWN}/**`,
        '**/.prettierrc*',
      ],
      plugins: {
        import: pluginImport,
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ];
}
