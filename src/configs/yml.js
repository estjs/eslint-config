import { GLOB_YAML } from '../globs';
import { parserYml, pluginYml } from '../plugins';

export const yml = [
	{
		files: [GLOB_YAML],
		languageOptions: {
			parser: parserYml,
		},
		plugins: {
			yml: pluginYml,
		},
		rules: {
			...pluginYml.configs.standard.rules,
			...pluginYml.configs.prettier.rules,
			'yml/no-empty-mapping-value': 'off',
		},
	},
];
