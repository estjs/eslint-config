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
} from './configs';

function getOverrides(overrides, key) {
	return overrides?.[key] || {};
}

const defaultOptions = {
	vue: hasVue,
	biome: true,
	markdown: true,
	unocss: hasUnocss,
	typescript: hasTypeScript,
	react: hasReact,
	test: hasTest,
};

export function estjs(options = defaultOptions, overrides = {}) {
	const {
		vue: enableVue,
		biome: enableBiome,
		markdown: enableMarkdown,
		unocss: enableUnocss,
		typescript: enableTS,
		react: enableReact,
		test: enableTest,
	} = options;

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
	];

	if (enableVue) configs.push(...vue(getOverride('vue')));
	if (enableMarkdown) configs.push(...markdown(getOverride('markdown')));
	if (enableUnocss) configs.push(...unocss);
	if (enableBiome) configs.push(...biome);
	if (enableReact) configs.push(...react(getOverride('react')));
	if (enableTS) configs.push(...typescript(getOverride('typescript')));
	if (enableTest) configs.push(...test(getOverride('test')));

	return configs;
}
