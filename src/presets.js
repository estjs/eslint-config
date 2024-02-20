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
	node,
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

function getOverrides(overrides, key) {
	return overrides?.[key] || {};
}

const isNode = () =>
	typeof process !== 'undefined' && !!process.versions && !!process.versions.node;

/**
 * Generate the estjs configuration based on the provided options and overrides.
 *
 * @param {object} options - The default options for the estjs configuration
 * @param {object} overrides - The overrides for the default options
 * @return {Array} The estjs configuration based on the provided options and overrides
 */
export function estjs(
	overrides = {},
	{
		vue: enableVue = hasVue,
		biome: enableBiome = true,
		markdown: enableMarkdown = true,
		unocss: enableUnocss = hasUnocss,
		typescript: enableTS = hasTypeScript,
		react: enableReact = hasReact,
		test: enableTest = hasTest,
		node: enableNode = isNode(),
	} = {},
) {
	const getOverride = key => getOverrides(overrides, key);

	const configs = [
		...ignores,
		...javascript(getOverride('javascript')),
		...comments,
		...imports(getOverride('imports')),
		...unicorn(getOverride('unicorn')),
		...jsdoc(getOverride('jsdoc')),
		...sortKeys,
		...jsonc,
		...sortPackageJson,
		...sortTsconfig,
		...yml,
	];

	if (enableVue) configs.push(...vue(getOverride('vue')));
	if (enableMarkdown) configs.push(...markdown(getOverride('markdown')));
	if (enableUnocss) configs.push(...unocss);
	if (enableBiome) configs.push(...biome);
	if (enableReact) configs.push(...react(getOverride('react')));
	if (enableTS) configs.push(...typescript(getOverride('typescript')));
	if (enableTest) configs.push(...test(getOverride('test')));
	if (enableNode) configs.push(...node);

	return configs;
}
