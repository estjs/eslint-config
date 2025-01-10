import { pluginRegexp } from '../plugins';
export function regexp() {
  const config = pluginRegexp.configs['flat/recommended'];
  const rules = {
    ...config.rules,
  };

  for (const key in rules) {
    if (rules[key] === 'error') {
      rules[key] = 'warn';
    }
  }
  return [
    {
      ...config,
      rules,
    },
  ];
}
