module.exports = {
  extends: ['plugin:yml/prettier', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        printWidth: 120,
        singleQuote: true,
        quoteProps: 'preserve',
        jsxSingleQuote: true,
      },
    ],
  },
}
