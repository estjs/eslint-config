import { GLOB_SRC, GLOB_VUE } from '../globs';
import { pluginNode } from '../plugins';

export const node = [
  {
    files: [GLOB_SRC, GLOB_VUE, '**/*.md/**'],
    plugins: {
      node: pluginNode,
    },
    rules: {
      'node/handle-callback-err': ['error', '^(err|error)$'],
      'node/no-deprecated-api': 'error',
      'node/no-exports-assign': 'error',
      'node/no-new-require': 'error',
      'node/no-path-concat': 'error',
      'node/no-unsupported-features/es-builtins': 'error',
      'node/prefer-global/buffer': ['error', 'never'],
      'node/prefer-global/process': ['error', 'never'],
      'node/process-exit-as-throw': 'error',
    },
  },
];
