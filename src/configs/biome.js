import { pluginBiome } from '../plugins';
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

export const biome = [
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
      biome: pluginBiome,
    },
    rules: {
      'biome/biome': [
        'warn',
        {
          length: 80,
        },
      ],
    },
  },
];
