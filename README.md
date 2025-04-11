# @estjs/eslint-config

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3,React, Node, Regexp, Unocss, Markdown, Jsdoc.

## Features

- Format with Biome,[off Biome include rules](https://github.com/ftzi/eslint-config-biome).
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


## benchmark
### project

> benchmark with [vue github project](https://github.com/vuejs/core)(commit 2e6ec398114bef171984782cb9cee36d460b047a)

```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
TypeScript                     481          12770           9430         118422
YAML                            16           1621              6           5845
Markdown                        31           2196              0           4302
HTML                            26            193             26           2153
JavaScript                      34            268            493           1970
JSON                            32              2              0           1082
Vuejs Component                 11             77             15            707
CSS                              1             15              0             81
JSON5                            1              6             10             59
SVG                              1              0              0              4
SCSS                             1              0              0              3
TOML                             1              0              0              3
-------------------------------------------------------------------------------
SUM:                           636          17148           9980         134631
```

before use prettier and eslint (eslint . --fix)
real    1m42.396s
user    0m0.106s
sys     0m0.076s

after use biome and eslint (eslint . --fix)
real    0m17.829s
user    0m0.000s
sys     0m0.121s

