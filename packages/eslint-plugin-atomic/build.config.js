import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/dirs',
    'src/index',
    'src/worker-sort',
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
