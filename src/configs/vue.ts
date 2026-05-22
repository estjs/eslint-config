import type { Linter } from 'eslint';
import { isVue3 } from '../env';
import { GLOB_VUE } from '../globs';
import { parserTypeScript, parserVue, pluginTypeScript, pluginVue } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, VueRulesOverride } from '../types';
import { typescriptBaseRules } from './typescript';

/**
 * Custom overrides applied on top of `eslint-plugin-vue`'s recommended preset for the
 * detected Vue major version.
 */
export const vueCustomRules: Linter.RulesRecord = {
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
    { avoidQuotes: true, ignoreConstructors: false },
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

export const vue2Rules: Linter.RulesRecord = {
  ...pluginVue.configs.base.rules,
  ...pluginVue.configs['vue2-essential'].rules,
  ...pluginVue.configs['vue2-strongly-recommended'].rules,
  ...pluginVue.configs['vue2-recommended'].rules,
};

export const vue3Rules: Linter.RulesRecord = {
  ...pluginVue.configs.base.rules,
  ...pluginVue.configs.essential.rules,
  ...pluginVue.configs['strongly-recommended'].rules,
  ...pluginVue.configs.recommended.rules,
};

/** Globals injected by Vue's reactivity-transform compiler macros. */
export const vueReactivityTransformGlobals = {
  $: 'readonly',
  $$: 'readonly',
  $computed: 'readonly',
  $customRef: 'readonly',
  $ref: 'readonly',
  $shallowRef: 'readonly',
  $toRef: 'readonly',
} as const satisfies Linter.Globals;

export interface VueOptions {
  files?: string[];
  rules?: VueRulesOverride;
  /** Set to `true` to share the TypeScript base rule set inside `<script>` blocks. */
  typescript?: boolean;
}

/** Globals + plugin wiring for projects using Vue's reactivity-transform compiler. */
export const vueReactivityTransform: FlatConfig[] = [
  {
    name: 'estjs/vue/reactivity-transform',
    languageOptions: {
      globals: vueReactivityTransformGlobals,
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      'vue/no-setup-props-reactivity-loss': 'off',
    },
  },
];

export function vue(options: VueOptions = {}): FlatConfig[] {
  const { files = [GLOB_VUE], typescript: useTS = false } = options;
  const userRules = normalizeRules(options.rules, 'vue');
  const tsRulesForVue = useTS
    ? {
        ...typescriptBaseRules,
        '@typescript-eslint/consistent-type-imports': 'off',
      }
    : {};

  return [
    {
      name: 'estjs/vue/setup',
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          extraFileExtensions: ['.vue'],
          parser: useTS ? parserTypeScript : undefined,
          sourceType: 'module',
        },
      },
      plugins: {
        '@typescript-eslint': pluginTypeScript,
        'vue': pluginVue,
      },
      processor: pluginVue.processors['.vue'],
      rules: tsRulesForVue,
    },
    {
      name: 'estjs/vue/rules',
      files,
      plugins: {
        vue: pluginVue,
      },
      rules: {
        ...(isVue3 ? vue3Rules : vue2Rules),
        ...vueCustomRules,
        ...userRules,
      },
    },
    ...vueReactivityTransform,
  ];
}
