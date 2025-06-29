# eslint-plugin-oxlint

Runs [oxlint](https://oxlintjs.dev/) as an [ESLint](https://eslint.org/) rule and reports differences as individual ESLint issues.

## Requirements

- Node.js >= 18
- ESLint >= 9.0.0

## Installation

```bash
npm install eslint-plugin-oxlint --save-dev
```

## Usage

### Configuration

Add `oxlint` to your ESLint plugins and configure the rules in your ESLint config:

```js
import pluginoxlint from 'eslint-plugin-oxlint';
export default {
  plugins: {
    oxlint: pluginoxlint,
  },
  rules: {
    'oxlint/oxlint': 'warn', // or 'error'
  },
};
```


### Custom Configuration

You can pass oxlint configuration options to customize formatting behavior:

```js
module.exports = {
  rules: {
    'oxlint/oxlint': [
      'warn',
      {
        formatter: {
          indentStyle: 'space',
          indentWidth: 2,
        },
        javascript: {
          formatter: {
            quoteStyle: 'single',
            quoteProperties: 'preserve',
          },
        },
      },
    ],
  },
};
```

## License

MIT

## Related

- [oxlint](https://oxlintjs.dev/) - The formatter/linter being used
- [ESLint](https://eslint.org/) - The pluggable linting utility

