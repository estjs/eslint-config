import { pluginBiome } from '../plugins';
import { GLOB_JS, GLOB_JSON, GLOB_JSONC, GLOB_JSX, GLOB_SRC } from '../globs';

export const biome = [
  {
    files: [GLOB_JSON, GLOB_JSONC, GLOB_JS, GLOB_SRC, GLOB_JSX],
    plugins: {
      biome: pluginBiome,
    },
    rules: {
      ...pluginBiome.configs.recommended.rules,
    },
  },
];
