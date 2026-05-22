import { join, resolve } from 'node:path';
import { execa } from 'execa';
import fs from 'fs-extra';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const targetDir = resolve('_fixtures-type-support');

beforeAll(async () => {
  await fs.rm(targetDir, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(targetDir, { recursive: true, force: true });
});

describe('type support', () => {
  it('accepts short rule names in a consumer TypeScript config', async () => {
    await fs.ensureDir(targetDir);
    await fs.writeFile(
      join(targetDir, 'eslint.config.ts'),
      `
        import { defineConfig } from '../dist/index.js';

        export default defineConfig({
          markdown: false,
          node: false,
          pnpm: true,
          prettier: false,
          react: true,
          regexp: true,
          test: true,
          typescript: true,
          unocss: false,
          vue: true,
          rules: {
            comments: { 'disable-enable-pair': 'warn' },
            imports: { 'no-default-export': 'off' },
            jsdoc: { 'check-access': 'off' },
            javascript: { 'no-console': 'off' },
            pnpm: {
              json: { 'json-enforce-catalog': 'error' },
              yaml: { 'yaml-no-unused-catalog-item': 'error' },
            },
            react: { 'no-array-index-key': 'off' },
            regexp: { 'no-empty-capturing-group': 'warn' },
            test: { 'no-conditional-expect': 'off' },
            typescript: {
              '@typescript-eslint/no-use-before-define': 'warn',
              'no-unused-vars': 'error',
            },
            unicorn: { 'filename-case': 'off' },
            vue: { 'html-self-closing': 'off' },
          },
        });
      `,
    );
    await fs.writeFile(
      join(targetDir, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            allowJs: false,
            module: 'nodenext',
            moduleResolution: 'nodenext',
            noEmit: true,
            strict: true,
            target: 'esnext',
          },
          include: ['eslint.config.ts'],
        },
        null,
        2,
      ),
    );

    const result = await execa(
      'pnpm',
      ['exec', 'tsc', '-p', join(targetDir, 'tsconfig.json'), '--pretty', 'false'],
      {
        cwd: resolve('.'),
        stdio: 'pipe',
      },
    );

    expect(result.exitCode).toBe(0);
  }, 30_0000);
});
