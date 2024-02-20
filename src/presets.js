import { isPackageExists } from 'local-pkg';
import { hasReact, hasTest, hasTypeScript, hasUnocss, hasVue } from './env';
import {
	biome,
	comments,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	markdown,
	react,
	sortKeys,
	sortPackageJson,
	sortTsconfig,
	test,
	typescript,
	unicorn,
	unocss,
	vue,
	yml,
} from './configs';
/** Ignore common files and include javascript support */
export const presetJavaScript = [
	...ignores,
	...javascript,
	...comments,
	...imports,
	...unicorn,
	...jsdoc,
];
/** Includes basic json(c) file support and sorting json keys */
export const presetJsonc = [...jsonc, ...sortPackageJson, ...sortTsconfig];
/** Includes markdown, yaml + `presetJsonc` support */
export const presetLangsExtensions = [...markdown, ...yml, ...presetJsonc];
/** Includes `presetJavaScript` and typescript support */
export const presetBasic = [...presetJavaScript, ...sortKeys];

export const presetAll = [...presetBasic, ...presetLangsExtensions, ...vue, ...unocss, ...biome];
export { presetBasic as basic, presetAll as all };
export const isReactExists = isPackageExists('react');
export const isTSExists = isPackageExists('typescript');
export const isTestExits = isPackageExists('jest') || isPackageExists('vitest');

/**
 * Generates an array of configurations based on the provided options.
 *
 * @param {Array} config - an array of configurations
 * @param {object} options - an object containing various enable flags for different configurations
 * @param {boolean} options.vue - flag to enable Vue configuration
 * @param {boolean} options.biome - flag to enable Biome configuration
 * @param {boolean} options.markdown - flag to enable Markdown configuration
 * @param {boolean} options.unocss - flag to enable Unocss configuration
 * @param {boolean} options.typescript - flag to enable TypeScript configuration
 * @param {boolean} options.react - flag to enable React configuration
 * @param {boolean} options.test - flag to enable Test configuration
 * @return {Array} an array of configurations
 */
export function estjs(
	config = [],
	{
		vue: enableVue = hasVue,
		biome: enableBiome = true,
		markdown: enableMarkdown = true,
		unocss: enableUnocss = hasUnocss,
		typescript: enableTS = hasTypeScript,
		react: enableReact = hasReact,
		test: enableTest = hasTest,
	} = {},
) {
	const configs = [...presetBasic, ...yml, ...presetJsonc];
	if (enableVue) {
		configs.push(...vue);
	}
	if (enableMarkdown) {
		configs.push(...markdown);
	}
	if (enableUnocss) {
		configs.push(...unocss);
	}
	if (enableBiome) {
		configs.push(...biome);
	}
	if (enableReact) {
		configs.push(...react);
	}
	if (enableTS) {
		configs.push(...typescript);
	}
	if (enableTest) {
		configs.push(...test);
	}
	if (Object.keys(config).length > 0) {
		configs.push(...(Array.isArray(config) ? config : [config]));
	}
	return configs;
}
