# @estjs/eslint-config

[![npm version](https://img.shields.io/npm/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![node version](https://img.shields.io/node/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![license](https://img.shields.io/npm/l/@estjs/eslint-config.svg)](https://github.com/estjs/eslint-config/blob/main/LICENSE)

> 为现代 JavaScript 和 TypeScript 项目提供的完整 ESLint Flat Config

一份统一覆盖 JavaScript、TypeScript、Vue 2/3、React、Node.js、RegExp、UnoCSS、Markdown、JSON/JSONC、YAML、JSDoc 的 ESLint flat config。

[English Documentation](./README.md)

## ✨ 特性

- **Flat config 优先**
  - 面向 ESLint 9+
  - 单一入口:`defineConfig(options?)`
- **自动检测**
  - 根据已安装依赖自动识别 `typescript`、`react`、`vue`、`vitest`/`jest`、`unocss`
  - 默认启用 `node`、`markdown`、`regexp`、`prettier`
- **短规则名**
  - 在对应插件分组下可以直接写 `'no-unused-vars'`,不需要 `'@typescript-eslint/no-unused-vars'`
- **广泛文件覆盖**
  - JavaScript、TypeScript、JSX、TSX、Vue
  - Markdown、HTML
  - JSON、JSON5、JSONC、YAML
  - RegExp、JSDoc、UnoCSS
- **工程卫生**
  - import 顺序与重复 import 检查
  - `package.json` 与 `tsconfig.json` 自动排序
  - 默认忽略常见生成文件
- **格式化集成**
  - 内置 [Prettier](https://github.com/prettier/prettier)
  - 默认合理且可覆盖
- **编辑器友好**
  - 为 `eslint --fix` 优化
  - 支持 `eslint-plugin-command` 注释驱动的 codemod

## 📋 环境要求

- Node.js `>=18`
- ESLint `>=9`
- Prettier `>=3`

## 📥 安装

```bash
# npm
npm install -D eslint prettier @estjs/eslint-config

# yarn
yarn add -D eslint prettier @estjs/eslint-config

# pnpm
pnpm add -D eslint prettier @estjs/eslint-config
```

## 🛠️ 快速上手

在项目根目录创建 `eslint.config.js`:

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig();
```

常见的定制:

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

`typescript`、`vue`、`react`、`test`、`imports`、`jsdoc`、`comments`、`regexp`、`pnpm`、`unicorn`
分组中,短规则名(如 `'no-unused-vars'`)与全限定名(如 `'@typescript-eslint/no-unused-vars'`)都可使用。

## 🔄 配置说明

`defineConfig` 接受单个 options 对象,结构如下:

```ts
defineConfig({
  // 功能开关 —— 全部可选
  typescript: boolean,   // 默认:自动检测
  vue: boolean,          // 默认:自动检测
  react: boolean,        // 默认:自动检测
  test: boolean,         // 默认:自动检测
  unocss: boolean,       // 默认:自动检测
  node: boolean,         // 默认:true
  markdown: boolean,     // 默认:true
  regexp: boolean,       // 默认:true
  pnpm: boolean,         // 默认:false
  prettier: boolean | PrettierOptions, // 默认:true。传 false 关闭,传对象与默认值合并

  // 项目级设置
  ignores: string[],
  globals: Record<string, 'readonly' | 'writable' | 'off'>,

  // 各分组规则覆盖。键名支持短名与全限定名两种写法。
  rules: {
    javascript: { /* ESLint 核心 + unused-imports */ },
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
      json:     { /* package.json 规则 */ },
      yaml:     { /* pnpm-workspace.yaml 规则 */ },
    },
  },
});
```

### 功能开关

| 选项 | 默认 | 描述 |
| --- | --- | --- |
| `markdown` | `true` | Markdown 检查 |
| `node` | `true` | Node.js 规则 |
| `prettier` | `true` | Prettier 集成(也可传 `PrettierOptions` 对象) |
| `regexp` | `true` | RegExp 检查 |
| `pnpm` | `false` | pnpm catalog / workspace 规则 |
| `typescript` | `auto` | 安装了 `typescript` 时启用 |
| `react` | `auto` | 安装了 `react` 时启用 |
| `vue` | `auto` | 安装了 `vue`、`nuxt`、`vitepress` 或 `@slidev/cli` 时启用 |
| `test` | `auto` | 安装了 `vitest` 或 `jest` 时启用 |
| `unocss` | `auto` | 安装了 `unocss`、`@unocss/webpack` 或 `@unocss/nuxt` 时启用 |

### 分组规则覆盖

在 `rules.<group>` 下传入覆盖。同一分组支持短名与全限定名混用:

```js
defineConfig({
  rules: {
    typescript: {
      'no-unused-vars': 'off',                        // 短名 —— 解析为 @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-explicit-any': 'error',  // 全限定名也可
    },
    pnpm: {
      json: { 'json-enforce-catalog': 'warn' },
      yaml: { 'yaml-no-unused-catalog-item': 'off' },
    },
  },
});
```

## 📦 包含范围

始终包含:

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

可开关(默认值见上):

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

## 📁 支持的文件

- `*.js`、`*.cjs`、`*.mjs`
- `*.jsx`
- `*.ts`、`*.cts`、`*.mts`
- `*.tsx`
- `*.vue`
- `*.md`
- `*.json`、`*.json5`、`*.jsonc`
- `*.yml`、`*.yaml`
- `*.html`
- `*.css`、`*.less`、`*.scss`

额外应用结构化排序:

- `package.json`
- `tsconfig.json`
- `tsconfig.*.json`

## 🎨 Prettier 默认值

Prettier 默认启用,内置的默认值包括:

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

通过顶层 `prettier` 字段覆盖或关闭:

```js
defineConfig({ prettier: false });                  // 完全关闭
defineConfig({ prettier: { semi: false } });        // 与默认值合并
```

## 🙈 默认忽略

默认忽略常见的生成与依赖目录,包括:

- `node_modules`
- `dist`
- lockfiles
- `output`、`coverage`、`temp`、`fixtures`
- `.nuxt`、`.vercel`、`.changeset`、`.idea`
- `CHANGELOG*.md`、`LICENSE*`
- `__snapshots__`
- `auto-imports.d.ts`、`components.d.ts`

可通过 `ignores` 追加。

## ⚙️ Command codemod

由 [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command) 提供。通过特殊
注释触发的按需微型 codemod 工具。

示例:

- `/// to-function`
- `/// to-arrow`
- `/// to-for-each`
- `/// to-for-of`
- `/// keep-sorted`

完整命令列表:https://github.com/antfu/eslint-plugin-command#built-in-commands

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

在编辑器保存或运行 `eslint --fix` 后会变为:

```ts
// eslint-disable-next-line require-await
async function foo(msg: string): void {
  console.log(msg);
}
```

## 💡 IDE 集成

获得最佳体验的方式:

- 使用 VS Code + [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- 启用 `editor.formatOnSave`
- 把 `eslint --fix` 作为主要的格式化入口

## ❓ 常见问题

### 如何排查配置问题?

1. 开启 ESLint 调试输出:

```bash
DEBUG=eslint:* eslint .
```

2. 打印某个文件的解析后配置:

```bash
npx eslint --print-config path/to/file.js
```

3. 常见原因:

- 缺失 peer dependency
- 本地 ESLint 配置覆盖了默认
- 文件后缀未匹配

## 📚 示例

### TypeScript + Vue 项目

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({
  typescript: true,
  vue: true,
});
```

### React + Node.js 项目

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
        // pnpm-workspace.yaml 的 YAML 规则
      },
    },
  },
});
```

### 关闭 Prettier

```js
import { defineConfig } from '@estjs/eslint-config';

export default defineConfig({ prettier: false });
```

## 🔁 从 v2 迁移

双参数合并为单参数,入口函数也改名:

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

其他 v2 → v3 重命名:

- `estjs(...)` → `defineConfig(...)`
- `EstjsOptions` / `EstjsOverrides` → `Options` / `RulesOverrides`
- `TypedFlatConfigItem` → `FlatConfig`

## 🤝 贡献

欢迎贡献。提交 Issue 或 PR 均可。

## 📄 License

[MIT](LICENSE) License © 2023-present [Estjs](https://github.com/estjs)
