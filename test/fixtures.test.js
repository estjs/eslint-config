import { join, resolve } from 'node:path';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';

import { afterAll, beforeAll, it } from 'vitest';

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});

runWithConfig('js', {
  vue: false,
});
runWithConfig('all', {
  typescript: true,
  vue: true,
  react: true,
});
runWithConfig('no-style', {
  typescript: true,
  vue: true,
});
runWithConfig('tab-double-quotes', {
  typescript: true,

  vue: true,
});

runWithConfig('ts-override', {
  typescript: true,
});

runWithConfig('ts-strict', {});

runWithConfig('ts-strict-with-react', {
  react: true,
});

runWithConfig('with-formatters', {
  typescript: true,
  vue: true,
});

runWithConfig('no-markdown-with-formatters', {});

function runWithConfig(name, configs = {}, items = {}) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const binPath = resolve('./bin/index.mjs');
      const from = resolve('fixtures/input');
      const output = resolve('fixtures/output', name);
      const target = resolve('_fixtures', name);

      await fs.copy(from, target, {
        filter: src => {
          return !src.includes('node_modules');
        },
      });
      await fs.writeFile(
        join(target, 'eslint.config.js'),
        `
// @eslint-disable
import {estjs} from '@estjs/eslint-config'

export default estjs(
  ${JSON.stringify(items) ?? {}},
  ${JSON.stringify(configs)},
)
  `,
      );

      await execa('pnpx', ['eslint', '.', '--fix'], {
        cwd: target,
        stdio: 'pipe',
        reject: false,
      });

      const files = await fg('**/*', {
        ignore: ['node_modules', 'eslint.config.js'],
        cwd: target,
      });

      await Promise.all(
        files.map(async file => {
          const content = await fs.readFile(join(target, file), 'utf-8');
          const source = await fs.readFile(join(from, file), 'utf-8');
          const outputPath = join(output, file);
          if (content === source) {
            if (fs.existsSync(outputPath)) {
              // await fs.remove(outputPath);
            }
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
      );
    },
    30_000,
  );
}
