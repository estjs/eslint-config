module.exports = {
  plugins: [
    'check-file'
  ],
  rules: {
    'check-file/folder-match-with-fex': [
      'error',
      {
        '*.{test,spec}.{js,jsx,ts,tsx}': '**/__tests__/',
        '*.styled.{jsx,tsx}': '**/pages/'
      }
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{jsx,tsx,js,ts,vue}': 'CAMEL_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        '**/*': 'KEBAB_CASE',
      }
    ]
  }
};
