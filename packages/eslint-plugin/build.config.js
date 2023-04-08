import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/utils/dirs',
    'src/index',
    'src/utils/worker-sort',
    'src/utils/parser-short',
    'src/utils/unocss-short',
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
