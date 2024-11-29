import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/index'],
	clean: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
});
