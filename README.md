# @estjs/eslint-config

[![npm version](https://img.shields.io/npm/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![node version](https://img.shields.io/node/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![license](https://img.shields.io/npm/l/@estjs/eslint-config.svg)](https://github.com/estjs/eslint-config/blob/main/LICENSE)

> Comprehensive flat ESLint configuration for modern JavaScript and TypeScript projects

A unified ESLint flat config for JavaScript, TypeScript, Vue 2/3, React, Node.js, RegExp, UnoCSS, Markdown, JSON/JSONC, YAML, and JSDoc.

[中文文档](./README.zh-CN.md)

## ✨ Features

- **Flat config first**
  - Built for ESLint 9+
  - One entry point: `estjs(overrides?, options?)`
- **Auto-detected features**
  - Detects `typescript`, `react`, `vue`, `vitest`/`jest`, and `unocss` from installed dependencies
  - Keeps `node`, `markdown`, and `prettier` enabled by default
- **Broad file coverage**
  - JavaScript, TypeScript, JSX, TSX, Vue
  - Markdown, HTML
  - JSON, JSON5, JSONC, YAML
  - RegExp, JSDoc, UnoCSS
- **Project hygiene included**
  - Import ordering and duplicate import checks
  - Sorting for `package.json` and `tsconfig.json`
  - Common generated files ignored by default
- **Formatter integration**
  - Built-in [Prettier](https://github.com/prettier/prettier) integration
  - Sensible defaults with override support
- **Editor-friendly**
  - Designed for `eslint --fix`
  - Supports `eslint-plugin-command` comment-driven codemods

## 📋 Requirements

- Node.js `>=18`
- ESLint `>=9`
- Prettier `>=3`

## 📥 Installation

```bash
# npm
npm install -D eslint prettier @estjs/eslint-config

# yarn
yarn add -D eslint prettier @estjs/eslint-config

# pnpm
pnpm add -D eslint prettier @estjs/eslint-config
```

## 🛠️ Quick Start

Create an `eslint.config.js` file in your project root:

```js
import { estjs } from '@estjs/eslint-config';

export default estjs();
```

Typical customization:

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    javascript: {
      'no-console': 'off',
    },
    imports: {
      'import/no-default-export': 'off',
    },
    ignores: ['dist', 'coverage'],
  },
  {
    typescript: true,
    react: true,
    vue: false,
    test: true,
    pnpm: false,
  },
);
```

## 🔄 Configuration

### First argument: overrides

Use the first argument to override rules or config fragments:

```js
export default estjs({
  javascript: {
    // overrides rules
    // @see https://eslint.org/docs/latest/rules/
    // @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    // @see https://github.com/sweepline/eslint-plugin-unused-imports#supported-rules
  },
  typescript: {
    // overrides rules
    // @see https://typescript-eslint.io/rules/
  },
  imports: {
    // overrides rules
    // @see https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#rules
  },
  unicorn: {
    // overrides rules
    // @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
  },
  jsdoc: {
    // overrides rules
    // @see https://github.com/gajus/eslint-plugin-jsdoc#rules
  },
  vue: {
    // overrides rules
    // @see https://eslint.vuejs.org/rules/
  },
  markdown: {
    // overrides rules
    // @see https://github.com/eslint/markdown#rules
  },
  prettier: {
    // overrides rules
    // @see https://github.com/prettier/eslint-plugin-prettier#options
  },
  react: {
    // overrides rules
    // @see https://www.eslint-react.xyz/docs/rules/overview
    // @see https://www.eslint-react.xyz/docs/rules/jsx-key-before-spread
  },
  test: {
    // overrides rules
    // @see https://github.com/vitest-dev/eslint-plugin-vitest#rules
  },
  regexp: {
    // overrides rules
    // @see https://ota-meshi.github.io/eslint-plugin-regexp/rules/
  },
  comments: {
    // overrides rules
    // @see https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/
  },
  command: {
    // overrides rules
    // @see https://github.com/antfu/eslint-plugin-command
  },
    yaml: {
      // overrides rules
      // @see https://ota-meshi.github.io/eslint-plugin-yml/rules/
    },
    json: {
      // overrides rules
      // @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/
    },
  pnpm: {
    // overrides rules
    // @see https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules
  },
  globals: {
    // extra globals
    // @see https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
    MyGlobal: 'readonly',
  },
  ignores: [
    // extra ignore patterns
    'dist',
    '.cache',
  ],
});
```

Supported override keys:

- `javascript`
- `typescript`
- `imports`
- `unicorn`
- `jsdoc`
- `vue`
- `markdown`
- `prettier`
- `react`
- `test`
- `regexp`
- `comments`
- `command`
- `pnpm`
- `globals`
- `ignores`

### Second argument: feature flags

The second argument controls which optional groups are enabled:

| Option | Default | Description |
| --- | --- | --- |
| `markdown` | `true` | Enable Markdown linting |
| `vue` | `auto` | Enable Vue support |
| `unocss` | `auto` | Enable UnoCSS support |
| `typescript` | `auto` | Enable TypeScript support |
| `react` | `auto` | Enable React support |
| `node` | `true` | Enable Node.js specific rules |
| `prettier` | `true` | Enable Prettier formatting |
| `pnpm` | `false` | Enable PNPM-specific rules |
| `test` | `auto` | Enable test rules |

### Auto detection

If a feature flag is not set explicitly:

- `typescript` is enabled when `typescript` is installed
- `react` is enabled when `react` is installed
- `vue` is enabled when `vue`, `nuxt`, `vitepress`, or `@slidev/cli` is installed
- `test` is enabled when `vitest` or `jest` is installed
- `unocss` is enabled when `unocss`, `@unocss/webpack`, or `@unocss/nuxt` is installed

## 📦 What Is Included

These config groups are always included:

- `ignores`
- `javascript`
- `comments`
- `imports`
- `unicorn`
- `jsdoc`
- `sort-keys`
- `jsonc`
- `sort package.json`
- `sort tsconfig.json`
- `yml`
- `regexp`
- `command`

These groups are conditional:

- `typescript`
- `react`
- `vue`
- `test`
- `unocss`
- `markdown`
- `node`
- `prettier`
- `pnpm`

## 📁 Supported Files

The built-in config covers:

- `*.js`, `*.cjs`, `*.mjs`
- `*.jsx`
- `*.ts`, `*.cts`, `*.mts`
- `*.tsx`
- `*.vue`
- `*.md`
- `*.json`, `*.json5`, `*.jsonc`
- `*.yml`, `*.yaml`
- `*.html`
- `*.css`, `*.less`, `*.scss`

Additional structured sorting is applied to:

- `package.json`
- `tsconfig.json`
- `tsconfig.*.json`

## 🎨 Prettier Defaults

Prettier is enabled by default with built-in defaults including:

- `printWidth: 100`
- `tabWidth: 2`
- `semi: true`
- `singleQuote: true`
- `quoteProps: 'consistent'`
- `arrowParens: 'avoid'`
- `trailingComma: 'all'`
- `endOfLine: 'auto'`
- `vueIndentScriptAndStyle: false`
- `singleAttributePerLine: false`

Override them through the `prettier` field in the first argument.

## 🙈 Default Ignores

The config ignores common generated and dependency paths by default, including:

- `node_modules`
- `dist`
- lockfiles
- `output`
- `coverage`
- `temp`
- `fixtures`
- `.nuxt`
- `.vercel`
- `.changeset`
- `.idea`
- `CHANGELOG*.md`
- `LICENSE*`
- `__snapshots__`
- `auto-imports.d.ts`
- `components.d.ts`

Append more patterns through `ignores`.

## command

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is an on-demand micro-codemod tool triggered by special comments.

Examples:

- `/// to-function`
- `/// to-arrow`
- `/// to-for-each`
- `/// to-for-of`
- `/// keep-sorted`

Full command list:
https://github.com/antfu/eslint-plugin-command#built-in-commands

Example:

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

After saving in the editor or running `eslint --fix`, it becomes:

```ts
// eslint-disable-next-line require-await
async function foo(msg: string): void {
  console.log(msg);
}
```

## 💡 IDE Integration

For the best developer experience:

- Use VS Code with the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Enable `editor.formatOnSave`
- Use `eslint --fix` as the primary formatting entry

## ❓ FAQ

### Which formatter should I choose?

- **Prettier** is enabled by default and is the recommended formatter for this config

### How do I debug configuration issues?

1. Enable ESLint debug output:

```bash
DEBUG=eslint:* eslint .
```

2. Print the resolved config for a file:

```bash
npx eslint --print-config path/to/file.js
```

3. Common causes of issues:

- Missing peer dependencies
- Unexpected local ESLint overrides
- Files not matching expected extensions

## 📚 Examples

### TypeScript + Vue Project

```js
import { estjs } from '@estjs/eslint-config';

export default estjs({}, {
  vue: true,
  typescript: true,
});
```

### React + Node.js Project

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    javascript: {
      'no-console': 'warn',
    },
    react: {
      // overrides rules
      // @see https://www.eslint-react.xyz/docs/rules/overview
      // @see https://www.eslint-react.xyz/docs/rules/jsx-key-before-spread
      '@eslint-react/jsx-key-before-spread': 'error',
      '@eslint-react/no-array-index-key': 'off',
    },
    globals: {
      React: 'readonly',
    },
  },
  {
    react: true,
    node: true,
  },
);
```

### PNPM Workspace

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    pnpm: {
      yaml: {
        // YAML rules for pnpm-workspace.yaml
      },
    },
  },
  {
    pnpm: true,
  },
);
```

### Disable Prettier

```js
import { estjs } from '@estjs/eslint-config';

export default estjs({}, {
  prettier: false,
});
```

## 🤝 Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## 📄 License

[MIT](LICENSE) License © 2023-present [Estjs](https://github.com/estjs)
