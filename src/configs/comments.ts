import { pluginComments } from '../plugins';
import { normalizeRules } from '../shared';
import type { CommentsRulesOverride, FlatConfig } from '../types';

const PREFIX = '@eslint-community/eslint-comments';

export interface CommentsOptions {
  rules?: CommentsRulesOverride;
}

export function comments(options: CommentsOptions = {}): FlatConfig[] {
  const userRules = normalizeRules(options.rules, PREFIX);

  return [
    {
      name: 'estjs/comments/rules',
      plugins: {
        [PREFIX]: pluginComments,
      },
      rules: {
        ...pluginComments.configs.recommended.rules,
        [`${PREFIX}/disable-enable-pair`]: ['error', { allowWholeFile: true }],
        ...userRules,
      },
    },
  ];
}
