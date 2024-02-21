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

/**
 * Generate ESLint configs based on project environment and overrides.
 * @param {object} overrides - Custom ESLint configuration overrides.
 * @param {object} options - Optional feature flags for enabling/disabling specific ESLint configurations.
 * @param {boolean} options.vue - Enable Vue ESLint configurations.
 * @param {boolean} options.test - Enable test ESLint configurations.
 * @param {boolean} options.react - Enable React ESLint configurations.
 * @param {boolean} options.unocss - Enable Uno.css ESLint configurations.
 * @param {boolean} options.typescript - Enable TypeScript ESLint configurations.
 * @param {boolean} options.node - Enable Node.js ESLint configurations.
 * @param {boolean} options.biome - Enable Biome ESLint configurations.
 * @param {boolean} options.markdown - Enable Markdown ESLint configurations.
 * @returns {Array} - Array of ESLint configurations based on the provided options.
 */
export function estjs(
	overrides = {},
	{
		vue: enableVue = hasVue,
		test: enableTest = hasTest,
		react: enableReact = hasReact,
		unocss: enableUnocss = hasUnocss,
		typescript: enableTS = hasTypeScript,
		node: enableNode = true, // default to true
		biome: enableBiome = true,
		markdown: enableMarkdown = true,
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
	// default first plugin is biome
	if (enableBiome) configs.unshift(...biome);
	if (enableReact) configs.push(...react(getOverride('react')));
	if (enableTS) configs.push(...typescript(getOverride('typescript')));
	if (enableTest) configs.push(...test(getOverride('test')));
	if (enableNode) configs.push(...node);

	return configs;
}
