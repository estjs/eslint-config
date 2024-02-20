import { pluginBiome } from '../plugins';
export const biome = [
	{
		plugins: {
			biome: pluginBiome,
		},
		rules: {
			...pluginBiome.configs.recommended.rules,
		},
	},
];
