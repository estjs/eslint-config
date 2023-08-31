import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: [
		'src/utils/utils',
		'src/index',
		'src/utils/workerSort',
		'src/utils/unocssSort',
		'src/utils/parserShorthand',
		'src/utils/unocssShorthand',
	],
	clean: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
});
