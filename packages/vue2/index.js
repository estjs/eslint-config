module.exports = {
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
  extends: ['plugin:vue/recommended', '@estjs/eslint-config-ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^h$', argsIgnorePattern: '^h$' }],
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 3,
      },
    }],
    'vue/max-len': ['error', {
      code: 160,
      template: 160,
      tabWidth: 2,
      ignoreComments: true, ignoreTrailingComments: true, ignoreUrls: true, ignoreStrings: true, ignoreRegExpLiterals: true,
    }],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
}
