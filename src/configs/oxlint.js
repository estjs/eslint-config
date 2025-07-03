import { runAllOxlintFormat } from 'eslint-plugin-oxlint-x';
import {
  GLOB_JS,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_JSX,
  GLOB_MARKDOWN,
  GLOB_SRC,
  GLOB_TS,
  GLOB_TSX,
} from '../globs';
import { pluginOxlintX } from '../plugins';
import { isGlobalFormat } from '../env';

export function oxlint(config, customerConfig) {
  if (isGlobalFormat) {
    runAllOxlintFormat(customerConfig);
    return;
  } else {
    config.push(
      ...[
        {
          files: [
            GLOB_JSON,
            GLOB_JSONC,
            GLOB_JS,
            GLOB_SRC,
            GLOB_JSX,
            GLOB_JSON5,
            GLOB_TS,
            GLOB_TSX,
            GLOB_MARKDOWN,
          ],
          plugins: {
            oxlint: pluginOxlintX,
          },
          rules: {
            'oxlint/oxlint': ['warn', { ...customerConfig }],
          },
        },
      ],
    );
  }
}
