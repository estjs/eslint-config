import { pluginUnocss } from '../plugins';
import type { FlatConfig } from '../types';

export function unocss(): FlatConfig[] {
  return [
    {
      name: 'estjs/unocss/rules',
      ...(pluginUnocss.configs.flat as FlatConfig),
    },
  ];
}
