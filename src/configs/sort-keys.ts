import { pluginSortKeys } from '../plugins';
import type { FlatConfig } from '../types';

export const sortKeys: FlatConfig[] = [
  {
    name: 'estjs/sort-keys/setup',
    plugins: {
      'sort-keys': pluginSortKeys,
    },
  },
];
