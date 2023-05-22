import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/utils/workerSort',
    'src/utils/parserShorthand',
    'src/utils/unocssShorthand',
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
