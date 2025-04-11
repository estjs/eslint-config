import { estjs } from './dist/index.js';

export default estjs(
  {
    ignores: ['**/fixtures/**'],
  },
  {
    biome: true,
  },
);
