import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import eslintPluginOxlint from '../src/index.js';

const ruleTester = new RuleTester({
  // @ts-expect-error -- ESLint < 9 requires a parser path, but we are using v9 which requires an object.
  // The types are not up-to-date.
  parser: require('espree'),
});

describe('unit Tests', () => {
  it('should handle various linting cases with RuleTester', () => {
    // @ts-expect-error -- ESLint types are not up-to-date for flat config.
    ruleTester.run('oxlint/oxlint', eslintPluginOxlint.rules.oxlint, {
      valid: [
        {
          code: "const foo = 'bar';\n",
        },
        {
          code: "import fs from 'node:fs';\n",
        },
        {
          code: 'if (1 === 1) {}\n',
        },
      ],
      invalid: [
        {
          // Missing semicolon
          code: "var foo = 'bar'\\n",
          errors: [{ messageId: 'INSERT' }],
          output: "var foo = 'bar';\\n",
        },
        {
          // eqeqeq
          code: 'if (a == b) {}\n',
          errors: [{ messageId: 'REPLACE' }],
          output: 'if (a === b) {}\n',
        },
        {
          // unicorn/prefer-node-protocol
          code: "import fs from 'fs';\n",
          errors: [{ messageId: 'REPLACE' }],
          output: "import fs from 'node:fs';\n",
        },
        {
          // no-debugger (no fix)
          code: 'debugger;',
          errors: [{ messageId: 'REPLACE' }],
          output: 'debugger;',
        },
        {
          // no-const-assign (no fix)
          code: 'const a = 1; a = 2;',
          errors: [{ messageId: 'REPLACE' }],
          output: 'const a = 1; a = 2;',
        },
      ],
    });
  });

  it('should respect plugin options', () => {
    // @ts-expect-error -- ESLint types are not up-to-date for flat config.
    ruleTester.run('oxlint/oxlint', eslintPluginOxlint.rules.oxlint, {
      valid: [
        {
          // This would normally be an error, but deny-warnings should suppress it.
          // Note: This test assumes oxlint treats this as a "warning" by default.
          // The behavior might vary.
          code: 'if (a == b) {}\n',
          options: [{ 'deny-warnings': false }], // A hypothetical option to demonstrate passing options
        },
      ],
      invalid: [],
    });
  });
});
