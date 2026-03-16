# @estjs/eslint-config

[![npm version](https://img.shields.io/npm/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![node version](https://img.shields.io/node/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![license](https://img.shields.io/npm/l/@estjs/eslint-config.svg)](https://github.com/estjs/eslint-config/blob/main/LICENSE)

> 面向现代 JavaScript 和 TypeScript 项目的完整 Flat ESLint 配置

这是一个统一的 ESLint flat config，支持 JavaScript、TypeScript、Vue 2/3、React、Node.js、RegExp、UnoCSS、Markdown、JSON/JSONC、YAML 和 JSDoc。

[English](./README.md)

## ✨ 特性

- **Flat config 优先**
  - 基于 ESLint 9+
  - 单一入口：`estjs(overrides?, options?)`
- **自动检测能力**
  - 根据已安装依赖自动检测 `typescript`、`react`、`vue`、`vitest`/`jest`、`unocss`
  - `node`、`markdown`、`prettier` 默认开启
- **广泛的文件覆盖**
  - JavaScript、TypeScript、JSX、TSX、Vue
  - Markdown、HTML
  - JSON、JSON5、JSONC、YAML
  - RegExp、JSDoc、UnoCSS
- **内置工程治理**
  - 导入顺序和重复导入检查
  - 自动整理 `package.json` 和 `tsconfig.json`
  - 默认忽略常见生成文件和目录
- **格式化集成**
  - 内置 [Prettier](https://github.com/prettier/prettier) 集成
  - 提供一组可覆盖的合理默认值
- **编辑器友好**
  - 适合配合 `eslint --fix` 使用
  - 支持 `eslint-plugin-command` 的注释驱动 codemod

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

## 🛠️ 快速开始

在项目根目录创建 `eslint.config.js`：

```js
import { estjs } from '@estjs/eslint-config';

export default estjs();
```

常见自定义方式：

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

## 🔄 配置说明

### 第一个参数：覆盖项

第一个参数用于覆盖规则或配置片段：

```js
export default estjs({
  javascript: {
    // 覆盖规则
    // @see https://eslint.org/docs/latest/rules/
    // @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
    // @see https://github.com/sweepline/eslint-plugin-unused-imports#supported-rules
  },
  typescript: {
    // 覆盖规则
    // @see https://typescript-eslint.io/rules/
  },
  imports: {
    // 覆盖规则
    // @see https://github.com/un-ts/eslint-plugin-import-x?tab=readme-ov-file#rules
  },
  unicorn: {
    // 覆盖规则
    // @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
  },
  jsdoc: {
    // 覆盖规则
    // @see https://github.com/gajus/eslint-plugin-jsdoc#rules
  },
  vue: {
    // 覆盖规则
    // @see https://eslint.vuejs.org/rules/
  },
  markdown: {
    // 覆盖规则
    // @see https://github.com/eslint/markdown#rules
  },
  prettier: {
    // 覆盖规则
    // @see https://github.com/prettier/eslint-plugin-prettier#options
  },
  react: {
    // 覆盖规则
    // @see https://www.eslint-react.xyz/docs/rules/overview
    // @see https://www.eslint-react.xyz/docs/rules/jsx-key-before-spread
  },
  test: {
    // 覆盖规则
    // @see https://github.com/vitest-dev/eslint-plugin-vitest#rules
  },
  regexp: {
    // 覆盖规则
    // @see https://ota-meshi.github.io/eslint-plugin-regexp/rules/
  },
  comments: {
    // 覆盖规则
    // @see https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/
  },
  command: {
    // 覆盖规则
    // @see https://github.com/antfu/eslint-plugin-command
  },
    yaml: {
      // 覆盖规则
      // @see https://ota-meshi.github.io/eslint-plugin-yml/rules/
    },
    json: {
      // 覆盖规则
      // @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/
    },
   pnpm: {
    // 覆盖规则
    // @see https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules
  },
  globals: {
    // 额外全局变量
    // @see https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
    MyGlobal: 'readonly',
  },
  ignores: [
    // 额外忽略路径
    'dist',
    '.cache',
  ],
});
```

支持的覆盖字段：

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

### 第二个参数：功能开关

第二个参数用于控制哪些可选配置组启用：

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `markdown` | `true` | 开启 Markdown lint |
| `vue` | `auto` | 开启 Vue 支持 |
| `unocss` | `auto` | 开启 UnoCSS 支持 |
| `typescript` | `auto` | 开启 TypeScript 支持 |
| `react` | `auto` | 开启 React 支持 |
| `node` | `true` | 开启 Node.js 相关规则 |
| `prettier` | `true` | 开启 Prettier 格式化 |
| `pnpm` | `false` | 开启 PNPM 相关规则 |
| `test` | `auto` | 开启测试规则 |

### 自动检测

如果没有显式传入功能开关：

- 安装了 `typescript` 时自动开启 `typescript`
- 安装了 `react` 时自动开启 `react`
- 安装了 `vue`、`nuxt`、`vitepress` 或 `@slidev/cli` 时自动开启 `vue`
- 安装了 `vitest` 或 `jest` 时自动开启 `test`
- 安装了 `unocss`、`@unocss/webpack` 或 `@unocss/nuxt` 时自动开启 `unocss`

## 📦 内置内容

这些配置组默认总会包含：

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

这些配置组按条件启用：

- `typescript`
- `react`
- `vue`
- `test`
- `unocss`
- `markdown`
- `node`
- `prettier`
- `pnpm`

## 📁 支持的文件类型

内置配置覆盖：

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

另外还会对这些文件做结构化排序：

- `package.json`
- `tsconfig.json`
- `tsconfig.*.json`

## 🎨 Prettier 默认值

默认启用 Prettier，内置默认值包括：

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

可以通过第一个参数中的 `prettier` 字段进行覆盖。

## 🙈 默认忽略项

默认会忽略常见依赖目录和生成物，包括：

- `node_modules`
- `dist`
- 各类 lockfile
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

可以通过 `ignores` 继续追加。

## command

基于 [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command)。这是一个通过特殊注释触发的按需微型 codemod 工具。

例如：

- `/// to-function`
- `/// to-arrow`
- `/// to-for-each`
- `/// to-for-of`
- `/// keep-sorted`

完整命令列表：
https://github.com/antfu/eslint-plugin-command#built-in-commands

示例：

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

保存或执行 `eslint --fix` 后会变成：

```ts
// eslint-disable-next-line require-await
async function foo(msg: string): void {
  console.log(msg);
}
```

## 💡 IDE 集成

为了获得更好的开发体验，建议：

- 在 VS Code 中安装 [ESLint 扩展](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- 开启 `editor.formatOnSave`
- 以 `eslint --fix` 作为主要格式化入口

## ❓ FAQ

### 应该选择哪个格式化工具？

- **Prettier** 默认启用，也是这个配置推荐的格式化方案

### 如何排查配置问题？

1. 打开 ESLint 调试输出：

```bash
DEBUG=eslint:* eslint .
```

2. 查看某个文件的最终配置：

```bash
npx eslint --print-config path/to/file.js
```

3. 常见问题来源：

- 缺少 peer dependencies
- 本地存在意外的 ESLint 覆盖配置
- 文件扩展名没有匹配到预期规则

## 📚 示例

### TypeScript + Vue 项目

```js
import { estjs } from '@estjs/eslint-config';

export default estjs({}, {
  vue: true,
  typescript: true,
});
```

### React + Node.js 项目

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    javascript: {
      'no-console': 'warn',
    },
    react: {
      // 覆盖规则
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
        // pnpm-workspace.yaml 的 YAML 规则
      },
    },
  },
  {
    pnpm: true,
  },
);
```

### 关闭 Prettier

```js
import { estjs } from '@estjs/eslint-config';

export default estjs({}, {
  prettier: false,
});
```

## 🤝 贡献

欢迎提交 issue 或 pull request。

## 📄 License

[MIT](LICENSE) License © 2023-present [Estjs](https://github.com/estjs)
