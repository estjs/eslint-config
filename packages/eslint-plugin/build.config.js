import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/utils/dirs',
    'src/index',
    'src/utils/worker-sort',
    'src/utils/parser-shorthand',
    'src/utils/unocss-shorthand',
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
