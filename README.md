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
  - One entry point: `defineConfig(options?)`
- **Auto-detected features**
  - Detects `typescript`, `react`, `vue`, `vitest`/`jest`, and `unocss` from installed dependencies
  - Keeps `node`, `markdown`, `regexp`, and `prettier` enabled by default
- **Short rule names**
  - Write `'no-unused-vars'` instead of `'@typescript-eslint/no-unused-vars'` inside the matching plugin group
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
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig();
```

Typical customization:

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({
  typescript: true,
  react: true,
  vue: false,
  test: true,
  pnpm: false,

  ignores: ['dist', 'coverage'],

  rules: {
    javascript: {
      'no-console': 'off',
    },
    typescript: {
      'no-unused-vars': 'off',
    },
    vue: {
      'html-self-closing': 'off',
    },
    imports: {
      'no-default-export': 'off',
    },
  },
});
```

Short rule names are supported in plugin groups such as `typescript`, `vue`, `react`,
`test`, `imports`, `jsdoc`, `comments`, `regexp`, `pnpm`, and `unicorn`. Fully prefixed
names (e.g. `'@typescript-eslint/no-unused-vars'`) continue to work.

## 🔄 Configuration

`defineConfig` takes a single options object. The shape is:

```ts
defineConfig({
  // Feature toggles — every flag is optional.
  typescript: boolean,   // default: auto-detected
  vue: boolean,          // default: auto-detected
  react: boolean,        // default: auto-detected
  test: boolean,         // default: auto-detected
  unocss: boolean,       // default: auto-detected
  node: boolean,         // default: true
  markdown: boolean,     // default: true
  regexp: boolean,       // default: true
  pnpm: boolean,         // default: false
  prettier: boolean | PrettierOptions, // default: true — pass false to disable, or an object to merge into defaults

  // Project-wide settings.
  ignores: string[],
  globals: Record<string, 'readonly' | 'writable' | 'off'>,

  // Per-group rule overrides. Each key accepts short or fully prefixed names.
  rules: {
    javascript: { /* ESLint core + unused-imports */ },
    typescript: { /* @see https://typescript-eslint.io/rules/ */ },
    imports:    { /* @see https://github.com/un-ts/eslint-plugin-import-x */ },
    unicorn:    { /* @see https://github.com/sindresorhus/eslint-plugin-unicorn */ },
    jsdoc:      { /* @see https://github.com/gajus/eslint-plugin-jsdoc */ },
    vue:        { /* @see https://eslint.vuejs.org/rules/ */ },
    markdown:   { /* @see https://github.com/eslint/markdown */ },
    react:      { /* @see https://www.eslint-react.xyz/docs/rules/overview */ },
    test:       { /* @see https://github.com/vitest-dev/eslint-plugin-vitest */ },
    regexp:     { /* @see https://ota-meshi.github.io/eslint-plugin-regexp/rules/ */ },
    comments:   { /* @see https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/ */ },
    command:    { /* @see https://github.com/antfu/eslint-plugin-command */ },
    pnpm: {
      json:     { /* rules for package.json */ },
      yaml:     { /* rules for pnpm-workspace.yaml */ },
    },
  },
});
```

### Feature toggles

| Option | Default | Description |
| --- | --- | --- |
| `markdown` | `true` | Markdown linting |
| `node` | `true` | Node-specific rules |
| `prettier` | `true` | Prettier integration (also accepts a `PrettierOptions` object) |
| `regexp` | `true` | RegExp linting |
| `pnpm` | `false` | pnpm catalog / workspace rules |
| `typescript` | `auto` | Enabled when `typescript` is installed |
| `react` | `auto` | Enabled when `react` is installed |
| `vue` | `auto` | Enabled when `vue`, `nuxt`, `vitepress`, or `@slidev/cli` is installed |
| `test` | `auto` | Enabled when `vitest` or `jest` is installed |
| `unocss` | `auto` | Enabled when `unocss`, `@unocss/webpack`, or `@unocss/nuxt` is installed |

### Per-group rule overrides

Pass overrides under `rules.<group>`. The same key accepts both bare and fully prefixed
rule names:

```js
defineConfig({
  rules: {
    typescript: {
      'no-unused-vars': 'off',                        // short name — resolved to @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-explicit-any': 'error',  // fully-prefixed name also works
    },
    pnpm: {
      json: { 'json-enforce-catalog': 'warn' },
      yaml: { 'yaml-no-unused-catalog-item': 'off' },
    },
  },
});
```

## 📦 What Is Included

Always included:

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
- `command`

Toggleable (defaults shown above):

- `typescript`
- `react`
- `vue`
- `test`
- `unocss`
- `markdown`
- `node`
- `prettier`
- `pnpm`
- `regexp`

## 📁 Supported Files

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
- `arrowParens: 'always'`
- `trailingComma: 'all'`
- `endOfLine: 'auto'`
- `vueIndentScriptAndStyle: false`
- `singleAttributePerLine: false`
- `bracketSameLine: false`

Override or disable through the top-level `prettier` field:

```js
defineConfig({ prettier: false });                  // disable entirely
defineConfig({ prettier: { semi: false } });        // merge with defaults
```

## 🙈 Default Ignores

The config ignores common generated and dependency paths by default, including:

- `node_modules`
- `dist`
- lockfiles
- `output`, `coverage`, `temp`, `fixtures`
- `.nuxt`, `.vercel`, `.changeset`, `.idea`
- `CHANGELOG*.md`, `LICENSE*`
- `__snapshots__`
- `auto-imports.d.ts`, `components.d.ts`

Append more patterns through `ignores`.

## ⚙️ Command codemods

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is
an on-demand micro-codemod tool triggered by special comments.

Examples:

- `/// to-function`
- `/// to-arrow`
- `/// to-for-each`
- `/// to-for-of`
- `/// keep-sorted`

Full command list: https://github.com/antfu/eslint-plugin-command#built-in-commands

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

### TypeScript + Vue project

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({
  typescript: true,
  vue: true,
});
```

### React + Node.js project

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({
  react: true,
  node: true,
  globals: { React: 'readonly' },
  rules: {
    javascript: { 'no-console': 'warn' },
    react: {
      '@eslint-react/jsx-key-before-spread': 'error',
      '@eslint-react/no-array-index-key': 'off',
    },
  },
});
```

### pnpm workspace

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({
  pnpm: true,
  rules: {
    pnpm: {
      yaml: {
        // YAML rules for pnpm-workspace.yaml
      },
    },
  },
});
```

### Disable Prettier

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({ prettier: false });
```

## 🔁 Migrating from v2

Two parameters were collapsed into one and the entry point was renamed:

```diff
- import { estjs } from '@estjs/eslint-config';
-
- export default estjs(
-   {
-     javascript: { 'no-console': 'off' },
-     typescript: { 'no-unused-vars': 'off' },
-   },
-   { typescript: true, vue: true, prettier: false },
- );
+ import { defineConfig } from '@estjs/eslint-config';
+
+ export default defineConfig({
+   typescript: true,
+   vue: true,
+   prettier: false,
+   rules: {
+     javascript: { 'no-console': 'off' },
+     typescript: { 'no-unused-vars': 'off' },
+   },
+ });
```

Other v2 → v3 renames:

- `estjs(...)` → `defineConfig(...)`
- `EstjsOptions` / `EstjsOverrides` → `Options` / `RulesOverrides`
- `TypedFlatConfigItem` → `FlatConfig`

## 🤝 Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## 📄 License

[MIT](LICENSE) License © 2023-present [Estjs](https://github.com/estjs)
