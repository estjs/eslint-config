import { GLOB_JSX, GLOB_TSX } from '../globs';
import { pluginReact } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, ReactRulesOverride } from '../types';

export interface ReactOptions {
  files?: string[];
  rules?: ReactRulesOverride;
}

const recommended = pluginReact.configs.recommended;

export function react(options: ReactOptions = {}): FlatConfig[] {
  const { files = [GLOB_JSX, GLOB_TSX] } = options;
  const userRules = normalizeRules(options.rules, '@eslint-react');

  return [
    {
      name: 'estjs/react/setup',
      plugins: recommended.plugins,
      settings: recommended.settings,
    },
    {
      name: 'estjs/react/rules',
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
      rules: {
        ...recommended.rules,
        ...userRules,
      },
    },
  ];
}
