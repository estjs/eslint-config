# @estjs/eslint-config

Forked from [antfu/eslint-config](https://github.com/antfu/eslint-config)

## Usage

```bash
pnpm i -D @estjs/eslint-config-basic # JavaScript only
# Or yarn add -D / npm install -D
pnpm i -D @estjs/eslint-config-ts # JavaScript and TypeScript
pnpm i -D @estjs/eslint-config-vue # JavaScript, TypeScript and Vue 3
pnpm i -D @estjs/eslint-config-vue2 # JavaScript, TypeScript and Vue 2
pnpm i -D @estjs/eslint-config-react # JavaScript, TypeScript and react
pnpm i -D @estjs/eslint-config # JavaScript, TypeScript, Vue 3&2 and react
```

### Install

```bash
pnpm add -D eslint @estjs/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": ["@estjs/eslint-config"]
}
```

### Config `.eslintignore`

```txt
dist
public
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint \"**/*.{vue,ts.tsx,js,jsx}\""
  }
}
```

### Config VSCode auto fix

Create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
