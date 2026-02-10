import { join, resolve } from 'node:path';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';

import { afterAll, beforeAll, it } from 'vitest';

beforeAll(async () => {
  await fs.rm(resolve('test/_fixtures'), { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm(resolve('test/_fixtures'), { recursive: true, force: true });
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

// New test configuration with biome enabled
runWithConfig('with-biome', {
  typescript: true,
  vue: true,
  biome: true,
});

// Same configuration as 'all' but with biome enabled for comparison
runWithConfig('all-with-biome', {
  typescript: true,
  vue: true,
  react: true,
  biome: true,
});

function runWithConfig(name, configs = {}, items = {}) {
  it.concurrent(
    name,
    async ({ expect }) => {
      const from = resolve('test/fixtures/input');
      const output = resolve('test/fixtures/output', name);
      const target = resolve('test/_fixtures', name);

      await fs.copy(from, target, {
        filter: src => {
          return !src.includes('node_modules');
        },
      });
      await fs.writeFile(
        join(target, 'eslint.config.js'),
        `
// @eslint-disable
import {estjs} from '../dist/index.js'
export default estjs(
  ${JSON.stringify(items) ?? {}},
  ${JSON.stringify(configs)},
)
  `,
      );
      await execa('pnpx', ['eslint', './', '--fix'], {
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
              await fs.remove(outputPath);
            }
            return;
          }
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
      );
    },
    30_0000,
  );
}

function runWithOxlint(name, configs = {}, items = {}) {
  it.concurrent(
    `oxlint-${name}`,
    async ({ expect }) => {
      const from = resolve('test/fixtures/input');
      const output = resolve('test/fixtures/output', name);
      const target = resolve('test/_fixtures', `oxlint-${name}`);

      await fs.copy(from, target, {
        filter: src => {
          return !src.includes('node_modules');
        },
      });


      await execa('node', [resolve('src/oxlint.js'), '--fix', '--quiet'], {
        cwd: target,
        stdio: 'pipe',
        reject: false
      });

      const files = await fg('**/*', {
        ignore: ['node_modules', 'eslint.config.js', '.oxlintrc.json'],
        cwd: target,
      });

      await Promise.all(
        files.map(async file => {
          const content = await fs.readFile(join(target, file), 'utf-8');
          await expect.soft(content).toMatchFileSnapshot(join(output, file));
        }),
      );
    },
    30_0000,
  );
}

runWithOxlint('js', { vue: false });
runWithOxlint('all', { typescript: true, vue: true, react: true });
runWithOxlint('no-style', { typescript: true, vue: true });
runWithOxlint('tab-double-quotes', { typescript: true, vue: true });
runWithOxlint('ts-override', { typescript: true });
runWithOxlint('ts-strict', {});
runWithOxlint('ts-strict-with-react', { react: true });
runWithOxlint('with-formatters', { typescript: true, vue: true });
runWithOxlint('no-markdown-with-formatters', {});
runWithOxlint('with-biome', { typescript: true, vue: true, biome: true });
runWithOxlint('all-with-biome', { typescript: true, vue: true, react: true, biome: true });
