import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/utils/dirs',
    'src/index',
    'src/utils/worker-sort',
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
