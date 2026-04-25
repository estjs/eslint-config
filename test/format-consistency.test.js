import { join, relative, resolve } from 'node:path';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';

import { afterAll, beforeAll, describe, it } from 'vitest';

const inputDir = resolve('fixtures/format-consistency/input');
const outputDir = resolve('fixtures/format-consistency/output');
const targetDir = resolve('_fixtures-format-consistency');

beforeAll(async () => {
  await fs.rm(targetDir, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(targetDir, { recursive: true, force: true });
});

async function runFormat(name, configs = {}, items = {}) {
  const from = inputDir;
  const target = join(targetDir, name);

  await fs.copy(from, target, {
    filter: (src) => {
      return !src.includes('node_modules');
    },
  });
  const distPath = relative(target, resolve('dist/index.js'));
  await fs.writeFile(
    join(target, 'eslint.config.js'),
    `
// @eslint-disable
import {estjs} from '${distPath}'
export default estjs(
  ${JSON.stringify(items || {})},
  ${JSON.stringify(configs)},
)
  `,
  );
  await execa('npx', ['eslint', './', '--fix'], {
    cwd: target,
    stdio: 'pipe',
    reject: false,
  });

  const files = await fg('**/*', {
    ignore: ['node_modules', 'eslint.config.js'],
    cwd: target,
  });

  const results = {};
  const changedFiles = [];
  await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(join(target, file), 'utf-8');
      const source = await fs.readFile(join(from, file), 'utf-8');
      if (content === source) {
        return;
      }
      results[file] = content;
      changedFiles.push({ file, content });
    }),
  );

  return { results, changedFiles };
}

function extractScript(content) {
  if (!content) return [undefined, undefined];
  const match = content.match(/<script(?![^>]*lang="ts")[^>]*>([\s\S]*?)<\/script>/);
  const matchTs = content.match(/<script[^>]*lang="ts"[^>]*>([\s\S]*?)<\/script>/);
  return [match?.[1]?.trimStart(), matchTs?.[1]?.trimStart()];
}

describe('format consistency', () => {
  it('formats all file types and saves snapshots', async ({ expect }) => {
    const { results, changedFiles } = await runFormat('all', {
      typescript: true,
      vue: true,
      react: true,
    });

    // save snapshots
    const output = join(outputDir, 'all');
    for (const { file, content } of changedFiles) {
      const outputPath = join(output, file);
      await expect.soft(content).toMatchFileSnapshot(outputPath);
    }

    expect(Object.keys(results)).toContain('same-logic.js');
    expect(Object.keys(results)).toContain('same-logic.ts');
    expect(Object.keys(results)).toContain('same-logic.jsx');
    expect(Object.keys(results)).toContain('same-logic.tsx');
    expect(Object.keys(results)).toContain('same-logic.vue');
    expect(Object.keys(results)).toContain('same-logic-ts.vue');
  }, 30_000);

  it('core logic formatting is consistent across js / jsx / vue', async ({ expect }) => {
    const { results: jsxResults } = await runFormat('all-jsx-vue', {
      typescript: true,
      vue: true,
      react: true,
    });
    const { results: tsResults } = await runFormat('all-ts-tsx', {
      typescript: true,
      vue: true,
      react: true,
    });

    const ts = tsResults['same-logic.ts'];
    const tsx = tsResults['same-logic.tsx'];
    const js = jsxResults['same-logic.js'];
    const jsx = jsxResults['same-logic.jsx'];

    const vueRaw = jsxResults['same-logic.vue'];
    expect(vueRaw, 'same-logic.vue should be formatted').toBeDefined();
    const [vueScript] = extractScript(vueRaw);
    expect(vueScript, 'same-logic.vue script should be extracted').toBeDefined();

    const vueTsRaw = tsResults['same-logic-ts.vue'];
    expect(vueTsRaw, 'same-logic-ts.vue should be formatted').toBeDefined();
    const [, vueTsScript] = extractScript(vueTsRaw);
    expect(vueTsScript, 'same-logic-ts.vue script should be extracted').toBeDefined();

    expect(js).toBe(jsx);
    expect(jsx).toBe(vueScript);
    expect(vueScript).toBe(vueTsScript);
    expect(vueTsScript).toBe(ts);
    expect(ts).toBe(tsx);
  }, 30_0000);
});
