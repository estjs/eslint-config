import { pluginOxlintX } from '../plugins';

export function oxlint(overrides = {}) {
  return [
    {
      name: 'oxlint/plugin',
      plugins: {
        oxlint: pluginOxlintX,
      },
      rules: {
        'oxlint/oxlint': ['warn', overrides],
      },
    },
  ];
}
