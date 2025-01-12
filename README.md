# @estjs/eslint-config

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3,React, Node, Regexp, Unocss, Markdown, Jsdoc.

## Features

- Format with Biome,[off Biome include rules](./off-rules.js).
- Designed to work with TypeScript, Vue 2 and 3 out-of-box.
- Support JSON(5), YAML, Markdown...
- Sort imports, `package.json`, `tsconfig.json`...
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Reasonable defaults, best practices, only one-line of config

Require Node.js >= 18.

## Usage

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  // Features: it'll detect installed dependency and enable necessary features automatically
  {
    biome: true, // default true
    markdown: true, // default true
    vue: true, // auto detection
    unocss: false, // auto detection
  },
  // overrides config
  {
    javascript: {
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-console': 'off',
    },
    unicorn: {
      'unicorn/filename-case': 'off',
    },
    imports: {
      'import/no-default-export': 'off',
    },
  },
);
```


## biome config

use can create biome.json
```json
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["node_modules/@estjs/eslint-config/biome.json"]
}
```


