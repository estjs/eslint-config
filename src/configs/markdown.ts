import type { Linter } from 'eslint';
import { GLOB_MARKDOWN, GLOB_SRC, GLOB_VUE } from '../globs';
import { pluginMarkdown } from '../plugins';
import type { FlatConfig } from '../types';

export interface MarkdownOptions {
  rules?: Linter.RulesRecord;
}

export function markdown(options: MarkdownOptions = {}): FlatConfig[] {
  const { rules: userRules = {} } = options;

  return [
    ...(pluginMarkdown.configs.recommended as FlatConfig[]),
    {
      name: 'estjs/markdown/setup',
      files: [GLOB_MARKDOWN],
      plugins: {
        markdown: pluginMarkdown,
      },
      processor: 'markdown/markdown',
    },
    {
      name: 'estjs/markdown/code-blocks',
      files: [`${GLOB_MARKDOWN}/${GLOB_SRC}`, `${GLOB_MARKDOWN}/${GLOB_VUE}`],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',

        'no-alert': 'off',
        'no-console': 'off',
        'no-restricted-imports': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',

        'node/prefer-global/buffer': 'off',
        'node/prefer-global/process': 'off',

        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        ...userRules,
      },
    },
  ];
}
