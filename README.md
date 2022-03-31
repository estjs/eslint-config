# @ventjs/eslint-config

Forked from [antfu/eslint-config](https://github.com/antfu/eslint-config)

## Usage

```bash
pnpm i -D @ventjs/eslint-config-basic # JavaScript only
# Or yarn add -D / npm install -D
pnpm i -D @ventjs/eslint-config-ts # JavaScript and TypeScript
pnpm i -D @ventjs/eslint-config-vue # JavaScript, TypeScript and Vue 3
pnpm i -D @ventjs/eslint-config-vue2 # JavaScript, TypeScript and Vue 2

pnpm i -D @ventjs/eslint-config-prettier # Prettier only
pnpm i -D @ventjs/eslint-config # JavaScript, TypeScript, Vue 3&2 and Prettier
```

### Install

```bash
pnpm add -D eslint @ventjs/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": ["@ventjs/eslint-config"]
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
    "lint": "eslint \"**/*.{vue,ts,js}\""
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
