import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const dirname = resolve();
export default defineConfig({
	resolve: {
		alias: {
			'@/': `${resolve(dirname, 'src')}/`,
		},
	},
	define: {
		__DEV__: true,
	},
	test: {
		globals: true,
		watch: false,
	},
});
