import { getOxlintConfig } from '../oxlint';
import { pluginOxlint, pluginOxlintX } from '../plugins';

export function oxlint(overrides = {}) {
  const { mergedConfig, configPath, hasConfigFile } = getOxlintConfig(overrides);

  const officialConfig = hasConfigFile
    ? pluginOxlint.buildFromOxlintConfigFile(configPath)
    : Object.keys(overrides).length > 0
      ? pluginOxlint.buildFromOxlintConfig(overrides)
      : pluginOxlint.configs['flat/recommended'];

  const ruleConfig = mergedConfig;

  return [
    {
      name: 'oxlint/plugin',
      plugins: {
        oxlint: pluginOxlintX,
      },
      rules: {
        'oxlint/oxlint': ['warn', ruleConfig],
      },
    },
    ...(Array.isArray(officialConfig) ? officialConfig : [officialConfig]),
  ];
}
