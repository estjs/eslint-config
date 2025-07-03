import { estjs } from './dist/index.js';

export default estjs(
  {
    ignores: ['**/fixtures/**'],
  },
  {
    oxlint: true,
  },
);
