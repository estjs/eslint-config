# @estjs/eslint-config

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3.

## Features

- Format with Biome.
- Designed to work with TypeScript, Vue 2 and 3 out-of-box.
- Support JSON(5), YAML, Markdown...
- Sort imports, `package.json`, `tsconfig.json`...
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Reasonable defaults, best practices, only one-line of config


Require Node.js >= 16.14.

## Usage

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  [
    /* your custom config */
  ],
  // Features: it'll detect installed dependency and enable necessary features automatically
  {
    biome: true,
    markdown: true,
    vue: true, // auto detection
    unocss: false, // auto detection
  },
);
```



## VSCode

```jsonc
{
  "eslint.experimental.useFlatConfig": true
}
```
