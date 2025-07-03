# eslint-plugin-biome

Runs [Biome](https://biomejs.dev/) as an [ESLint](https://eslint.org/) rule and reports differences as individual ESLint issues.

## Requirements

- Node.js >= 18
- ESLint >= 9.0.0

## Installation

```bash
npm install eslint-plugin-biome --save-dev
```

## Usage

### Configuration

Add `biome` to your ESLint plugins and configure the rules in your ESLint config:

```js
import pluginBiome from 'eslint-plugin-biome';
export default {
  plugins: {
    biome: pluginBiome,
  },
  rules: {
    'biome/biome': 'warn', // or 'error'
  },
};
```


### Custom Configuration

You can pass Biome configuration options to customize formatting behavior:

```js
module.exports = {
  rules: {
    'biome/biome': [
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

- [Biome](https://biomejs.dev/) - The formatter/linter being used
- [ESLint](https://eslint.org/) - The pluggable linting utility

