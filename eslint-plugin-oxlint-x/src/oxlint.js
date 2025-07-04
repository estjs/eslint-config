import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import os from 'node:os';
import { getConfig, resolveOxlintBinary } from './helpers';

export async function format(code, options = {}) {
  const tempConfigPath = getConfig(options);
  const binPath = await resolveOxlintBinary();

  // Write the incoming code to a temporary file because oxlint currently
  // lacks `--stdin` support.
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'oxlint-'));
  const tmpFilePath = path.join(tmpDir, 'source.js');
  await fs.writeFile(tmpFilePath, code, 'utf8');

  try {
    const args = ['lint', '--fix', '--config', tempConfigPath, tmpFilePath];

    execSync(`${binPath} ${args.join(' ')}`, {
      stdio: 'inherit',
      env: process.env,
    });

    // Read the (potentially) formatted file content and return it.
    const formattedCode = await fs.readFile(tmpFilePath, 'utf8');
    return formattedCode.trim();
  } finally {
    // Cleanup temp files
    await Promise.all([
      fs.unlink(tempConfigPath).catch(() => {}),
      fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {}),
    ]);
  }
}

// Run oxlint format
export async function runAllOxlintFormat(oxlintConfig = {}) {
  // 1.  Collect CLI information
  // ---------------------------
  const args = process.argv.slice(2);

  // Whether to fix in-place (default true, unless `--no-fix` supplied)
  const shouldFix = !args.includes('--no-fix');

  // honour `--deny-warnings`
  const denyWarnings = args.includes('--deny-warnings');

  // All non flag args are treated as paths
  const paths = args.filter(a => !a.startsWith('-'));

  // If no explicit paths provided we treat it as "format entire project".
  const targetPaths = paths.length > 0 ? paths : ['.'];

  // ------------------------------------------------

  const extraConfigArgs = [];
  const tempConfigPath = getConfig(oxlintConfig);
  extraConfigArgs.push('--config', tempConfigPath);

  // -----------------------------
  // 3.  Assemble final CLI params
  // -----------------------------
  const cliArgs = [];

  if (shouldFix) cliArgs.push('--fix');
  if (denyWarnings) {
    cliArgs.push('--deny-warnings');
  }

  cliArgs.push(...extraConfigArgs);
  cliArgs.push(...targetPaths);

  const oxlintPath = await resolveOxlintBinary();

  // ---------------------------
  // 4.  Execute oxlint process
  // ---------------------------
  try {
    execSync(`${oxlintPath} ${cliArgs.join(' ')}`, {
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    // Allow non-zero exit codes (e.g. when oxlint reports diagnostics)
    if (typeof error.status === 'number') {
      // Exit code represents lint result – log and continue instead of throwing
      console.warn(`oxlint exited with code ${error.status}. Continuing…`);
    } else {
      // Re-throw unexpected failures (e.g. binary missing)
      throw error;
    }
  } finally {
    // Clean up temporary config file
    try {
      await fs.unlink(tempConfigPath);
    } catch (error) {
      console.error(`Failed to remove temporary config file: ${error.message}`);
    }
  }
}
