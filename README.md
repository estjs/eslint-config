# @estjs/eslint-config

[![npm version](https://img.shields.io/npm/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![node version](https://img.shields.io/node/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![license](https://img.shields.io/npm/l/@estjs/eslint-config.svg)](https://github.com/estjs/eslint-config/blob/main/LICENSE)

> Comprehensive flat ESLint configuration for modern JavaScript/TypeScript projects

A unified, easy-to-use ESLint configuration package supporting JavaScript, TypeScript, Vue 2, Vue 3, React, Node, RegExp, UnoCSS, Markdown, and JSDoc.

## ✨ Features

- 🔍 **Modern Format Engine** - Powered by [Biome](https://biomejs.dev/) with optimized rules
- 🚀 **Zero Configuration** - Works out-of-the-box with TypeScript, Vue 2/3, and more
- 📦 **Broad Support** - Handles JSON(5), YAML, Markdown, and other file formats
- 🧹 **Smart Organization** - Automatically sorts imports, `package.json`, `tsconfig.json`, etc.
- 🔧 **Flat Config System** - Uses [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) for easy composition
- ⚙️ **Auto Detection** - Intelligently enables features based on your project dependencies
- 💻 **Dev Experience** - Reasonable defaults and best practices with minimal configuration

## 📋 Requirements

- Node.js >= 18

## 📥 Installation

```bash
# npm
npm install -D @estjs/eslint-config

# yarn
yarn add -D @estjs/eslint-config

# pnpm
pnpm add -D @estjs/eslint-config
```

## 🛠️ Usage

Create an `eslint.config.js` file in your project root:

```js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  // Override default configurations
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

  // Configure features - auto-detected by default
  {
    biome: true, // default: false
    markdown: true, // default: true
    vue: true, // auto-detected based on dependencies
    unocss: false, // auto-detected based on dependencies
    typescript: true, // auto-detected based on dependencies
    react: true, // auto-detected based on dependencies
    node: true, // default: true
    prettier: true, // default: true
    pnpm: false, // default: false
    test: true, // auto-detected based on dependencies
  },
);
```

## 🔄 Configuration Options

### Override Rules

You can override any rules in the first parameter:

```js
export default estjs({
  // JavaScript/TypeScript related rules
  javascript: {
    // Override JavaScript related rules
  },

  // TypeScript specific rules (only applied when typescript is enabled)
  typescript: {
    // Override TypeScript related rules
  },

  // Import organization and validation
  imports: {
    // Override import plugin rules
  },

  // Unicorn plugin rules
  unicorn: {
    // Override unicorn plugin rules
  },

  // JSDoc validation rules
  jsdoc: {
    // Override JSDoc related rules
  },

  // Vue specific rules
  vue: {
    // Override Vue related rules
  },

  // Markdown processing rules
  markdown: {
    // Override Markdown related rules
  },

  // Biome configuration options
  biome: {
    // Override Biome config
  },

  // Prettier configuration
  prettier: {
    // Override Prettier config
  },

  // React specific rules
  react: {
    // Override React related rules
  },

  // Testing related rules
  test: {
    // Override testing related rules
  },

  // Global variables to enable
  globals: {
    // Define global variables
    myGlobal: true,
  },

  // RegExp validation rules
  regexp: {
    // Override RegExp related rules
  },

  // PNPM specific rules
  pnpm: {
    yaml: {}, // YAML config for PNPM
    json: {}, // JSON config for PNPM
  },

  // Patterns to ignore
  ignores: [
    // Add files/directories to ignore
    'dist',
    '.cache',
  ],
});
```

### Feature Flags

The second parameter controls which features to enable:

| Option       | Default    | Description                                 |
|--------------|------------|---------------------------------------------|
| `biome`      | `false`    | Enable Biome formatting integration         |
| `markdown`   | `true`     | Enable Markdown linting                     |
| `vue`        | `auto`     | Enable Vue support                          |
| `unocss`     | `auto`     | Enable UnoCSS support                       |
| `typescript` | `auto`     | Enable TypeScript support                   |
| `react`      | `auto`     | Enable React support                        |
| `node`       | `true`     | Enable Node.js specific rules               |
| `prettier`   | `true`     | Enable Prettier formatting                  |
| `pnpm`       | `false`    | Enable PNPM specific rules [see](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm)                  |
| `test`       | `auto`     | Enable testing rules                        |

> **Note**: When `biome` is enabled, it will automatically disable certain ESLint rules that conflict with Biome's rules. If using global formatting, it will run `biome format` on your files.

## 🔧 Biome Configuration

You can extend the default Biome configuration by creating a `biome.json` file in your project root:

```json
{
  "$schema": "node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["node_modules/@estjs/eslint-config/biome.json"],
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "rules": {
      // Your custom rules here
    }
  }
}
```

When `biome` is enabled and global formatting is active, `biome format` will run on your files. The configuration is merged with any Biome configuration found in your project.

## 📊 Additional Features

The config includes several additional features that are automatically applied:

- **Comments**: Rules for properly formatting comments
- **Sort Keys**: Automatic sorting of object keys
- **JSONC**: Support for JSON with comments
- **Sort Package JSON**: Automatic organization of package.json files
- **Sort TSConfig**: Automatic organization of tsconfig.json files
- **YAML**: Support for YAML files
- **RegExp**: Validation for regular expressions

## 📚 Examples

### TypeScript + Vue 3 Project

```js
// eslint.config.js
import { estjs } from '@estjs/eslint-config';

export default estjs(); // Auto-detects Vue and TypeScript
```

### React + Node.js Project

```js
// eslint.config.js
import { estjs } from '@estjs/eslint-config';

export default estjs({
  javascript: {
    'no-console': 'warn',
  },
  globals: {
    React: true,
  },
}); // Auto-detects React and Node.js
```

### Project with Biome for Formatting

```js
// eslint.config.js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    // Your rule overrides
  },
  {
    biome: true, // Enable Biome
    prettier: false, // Disable Prettier (optional as Biome will be used)
  },
);
```

### PNPM Workspace

```js
// eslint.config.js
import { estjs } from '@estjs/eslint-config';

export default estjs(
  {
    // Your rule overrides
    pnpm: {
      yaml: {
        // YAML-specific configs for pnpm-workspace.yaml
      },
    },
  },
  {
    pnpm: true, // Enable PNPM-specific rules
  },
);
```

### TODO
  [ ] to turn off biome's react configuration when in a vue project


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE) License © 2023-present [Est.js](https://github.com/estjs)


