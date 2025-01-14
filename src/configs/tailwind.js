import { pluginTailwindCSS } from '../plugins';

export function tailwind(overrides = {}) {
  return [
    {
      plugins: {
        tailwindcss: pluginTailwindCSS,
      },
      rules: {
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/no-custom-classname': 'warn',
        'tailwindcss/no-contradicting-classname': 'warn',
        ...overrides,
      },
    },
  ];
}
