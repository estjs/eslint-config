import tsPlugin from '@typescript-eslint/eslint-plugin';
import { isVue3 } from '../env';
import { GLOB_VUE } from '../globs';
import { parserTypeScript, parserVue, pluginVue } from '../plugins';
import { typescript } from './typescript';

export const reactivityTransform = [
  {
    languageOptions: {
      globals: {
        $: 'readonly',
        $$: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $toRef: 'readonly',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      'vue/no-setup-props-reactivity-loss': 'off',
    },
  },
];

const vueCustomRules = {
  'vue/block-order': 'off',
  'vue/custom-event-name-casing': ['error', 'camelCase'],
  'vue/eqeqeq': ['error', 'smart'],
  'vue/multi-word-component-names': 'off',
  'vue/no-constant-condition': 'warn',
  'vue/no-empty-pattern': 'error',
  'vue/no-loss-of-precision': 'error',
  'vue/no-unused-refs': 'error',
  'vue/no-useless-v-bind': 'error',
  'vue/no-v-html': 'off',
  'vue/object-shorthand': [
    'error',
    'always',
    {
      avoidQuotes: true,
      ignoreConstructors: false,
    },
  ],
  'vue/one-component-per-file': 'off',
  'vue/padding-line-between-blocks': ['error', 'always'],
  'vue/prefer-template': 'error',
  'vue/require-default-prop': 'off',
  'vue/require-prop-types': 'off',
  'vue/html-self-closing': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/max-attributes-per-line': 'off',
};

const vue2Rules = {
  ...pluginVue.configs.base.rules,
  ...pluginVue.configs['vue2-essential'].rules,
  ...pluginVue.configs['vue2-strongly-recommended'].rules,
  ...pluginVue.configs['vue2-recommended'].rules,
};

const vue3Rules = {
  ...pluginVue.configs.base.rules,
  ...pluginVue.configs.essential.rules,
  ...pluginVue.configs['strongly-recommended'].rules,
  ...pluginVue.configs.recommended.rules,
};

export function vue(overrides = {}, enableTS) {
  return [
    {
      files: [GLOB_VUE],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: enableTS ? parserTypeScript : null,
          sourceType: 'module',
        },
      },
      plugins: {
        '@typescript-eslint': tsPlugin,
        'vue': pluginVue,
      },
      processor: pluginVue.processors['.vue'],
      rules: {
        ...typescript()[0].rules,
      },
    },
    {
      plugins: {
        vue: pluginVue,
      },
      rules: {
        ...(isVue3 ? vue3Rules : vue2Rules),
        ...vueCustomRules,
        ...overrides,
      },
    },
    ...reactivityTransform,
  ];
}
