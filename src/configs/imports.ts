import { GLOB_MARKDOWN, GLOB_SRC, GLOB_SRC_EXT } from '../globs';
import { pluginImport } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, ImportRulesOverride } from '../types';

/**
 * Files in which a default export is conventional (config files, route/page entries,
 * type declaration files, markdown blocks, etc.) — relax `import/no-default-export` for them.
 */
const DEFAULT_EXPORT_ALLOWED_FILES = [
  `**/*config*.${GLOB_SRC_EXT}`,
  `**/views/${GLOB_SRC}`,
  `**/pages/${GLOB_SRC}`,
  '**/{index,vite,esbuild,rollup,webpack,rspack}.ts',
  '**/*.d.ts',
  `${GLOB_MARKDOWN}/**`,
  '**/.prettierrc*',
];

export interface ImportOptions {
  rules?: ImportRulesOverride;
}

export function imports(options: ImportOptions = {}): FlatConfig[] {
  const userRules = normalizeRules(options.rules, 'import');

  return [
    {
      name: 'estjs/imports/rules',
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

        'import/no-default-export': 'off',
        'import/no-mutable-exports': 'off',
        ...userRules,
      },
    },
    {
      name: 'estjs/imports/allow-default-export',
      files: DEFAULT_EXPORT_ALLOWED_FILES,
      plugins: {
        import: pluginImport,
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ];
}
