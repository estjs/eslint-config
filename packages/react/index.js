module.exports = {
  extends: [
    '@estjs/eslint-config-ts',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'jsx-quotes': [
      'error',
      'prefer-double',
    ],
    'react/jsx-no-bind': ['error', {
      allowArrowFunctions: true,
      allowBind: false,
      ignoreRefs: true
    }],
    'react/prop-types': 'off',
    'react/destructuring-assignment': 0,
    'react/no-unknown-property': 'error',
    'react/no-unused-prop-types': 'error',
    'react/no-did-update-set-state': 'error',

    'react/jsx-closing-tag-location': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],

    'react/react-in-jsx-scope': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
