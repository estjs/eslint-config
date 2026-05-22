// @ts-check
/**
 * CI / prepublish guard: regenerate src/rule-names.ts and fail when it differs from the
 * checked-in copy. Catches the case where a plugin version bump silently changed its rule
 * set but the type union was never regenerated.
 *
 *   pnpm verify-rule-names
 *
 * On mismatch the script exits 1 and tells the user to run `pnpm typegen`.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const target = resolve(repoRoot, 'src/rule-names.ts');

const previous = await readFile(target, 'utf8').catch(() => '');

const result = spawnSync('node', ['scripts/gen-rule-names.mjs'], {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const current = await readFile(target, 'utf8');

if (current !== previous) {
  // Restore so the workspace isn't left dirty after a CI failure.
  await writeFile(target, previous);
  console.error(
    '\n✗ src/rule-names.ts is out of date.\n  Run `pnpm typegen` and commit the result.\n',
  );
  process.exit(1);
}

console.log('✓ src/rule-names.ts is up to date');
