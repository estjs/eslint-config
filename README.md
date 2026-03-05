# @estjs/eslint-config

[![npm version](https://img.shields.io/npm/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![node version](https://img.shields.io/node/v/@estjs/eslint-config.svg)](https://www.npmjs.com/package/@estjs/eslint-config)
[![license](https://img.shields.io/npm/l/@estjs/eslint-config.svg)](https://github.com/estjs/eslint-config/blob/main/LICENSE)

> Comprehensive flat ESLint configuration for modern JavaScript/TypeScript projects

A unified, easy-to-use ESLint configuration package supporting JavaScript, TypeScript, Vue 2, Vue 3, React, Node, RegExp, UnoCSS, Markdown, and JSDoc.

## ✨ Features

- 🔍 **Multiple Format Engines**
  - [Prettier](https://github.com/prettier/prettier) - Default formatter with broad language support
- 🚀 **Zero Configuration** - Works out-of-the-box with TypeScript, Vue 2/3, React and more
- 📦 **Broad Support** 
  - JavaScript/TypeScript
  - Vue 2/3, React
  - JSON(5), YAML, Markdown
  - RegExp, JSDoc
  - UnoCSS
- 🧹 **Smart Organization** 
  - Auto-sorts imports
  - Organizes package.json
  - Structures tsconfig.json
  - Formats workspace files
- 🔧 **Modern Config System** 
  - Uses [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
  - Easy composition and extension
  - TypeScript-friendly configuration
- ⚙️ **Intelligent Detection** 
  - Auto-detects project features
  - Configures rules based on dependencies
  - Smart preset selection
- 💻 **Enhanced Dev Experience** 
  - Sensible defaults
  - Minimal configuration needed
  - Extensive IDE integration

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
  
  // ESlint Comments rules
  comments: {
    // Override eslint-comments related rules
  },
  
  // ESlint Plugin Command rules
  command: {
    // Override eslint-plugin-command related rules
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
| `markdown`   | `true`     | Enable Markdown linting                     |
| `vue`        | `auto`     | Enable Vue support                          |
| `unocss`     | `auto`     | Enable UnoCSS support                       |
| `typescript` | `auto`     | Enable TypeScript support                   |
| `react`      | `auto`     | Enable React support                        |
| `node`       | `true`     | Enable Node.js specific rules               |
| `prettier`   | `true`     | Enable Prettier formatting                  |
| `pnpm`       | `false`    | Enable PNPM specific rules                  |
| `test`       | `auto`     | Enable testing rules                        |




## command

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg)
}
```

Will be transformed to this when you hit save with your editor or run `eslint --fix`:

```ts
// eslint-disable-next-line require-await
async function foo(msg: string): void {
  console.log(msg)
}
```

The command comments are usually one-off and will be removed along with the transformation.




## 📊 Additional Features

The config includes several additional features that are automatically applied:

- **Comments**: Rules for properly formatting comments
- **Sort Keys**: Automatic sorting of object keys
- **JSONC**: Support for JSON with comments
- **Sort Package JSON**: Automatic organization of package.json files
- **Sort TSConfig**: Automatic organization of tsconfig.json files
- **YAML**: Support for YAML files
- **RegExp**: Validation for regular expressions


### IDE Integration

For the best development experience, we recommend:

- VS Code with [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Enable `editor.formatOnSave` in VS Code settings
- Install recommended extensions for your IDE

## ❓ FAQ

### Which formatter should I choose?

- **Prettier**: Best for projects that need broad language support. It's enabled by default.

### How to debug configuration issues?

1. Enable ESLint debug mode:
   ```bash
   DEBUG=eslint:* eslint .
   ```

2. Check resolved configuration:
   ```bash
   npx eslint --print-config path/to/file.js
   ```

3. Common issues:
   - Conflicting plugins
   - Missing peer dependencies
   - Incorrect file extensions

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


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE) License © 2023-present [Estjs](https://github.com/estjs)


