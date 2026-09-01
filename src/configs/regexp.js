import { GLOB_SRC, GLOB_VUE } from '../globs';
import { pluginRegexp } from '../plugins';
export function regexp(overrides) {
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
      files: [GLOB_SRC, GLOB_VUE, '**/*.md/**'],
      plugins: {
        regexp: pluginRegexp,
      },
      rules: {
        ...rules,
        ...overrides,
      },
    },
  ];
}
