import { GLOB_JSX, GLOB_TSX } from '../globs';
import { eslintReact } from '../plugins';

const files = [GLOB_JSX, GLOB_TSX];
const {
  plugins: reactPlugins,
  rules: reactRecommendedRules,
  settings: reactSettings,
} = eslintReact.configs.recommended;

export function react(overrides = {}) {
  return [
    {
      plugins: reactPlugins,
      settings: reactSettings,
    },
    {
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      rules: {
        ...reactRecommendedRules,
        ...overrides,
      },
    },
  ];
}
