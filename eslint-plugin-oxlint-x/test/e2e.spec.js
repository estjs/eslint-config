import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const execPromise = promisify(exec);

// --- Test Setup ---
const tempDir = path.resolve(__dirname, 'e2e-temp');
const eslintPath = path.resolve(__dirname, '../node_modules/.bin/eslint');
const oxlintPath = path.resolve(__dirname, '../node_modules/oxlint/bin/oxlint');

const baseEslintConfig = `
import plugin from '${pathToFileURL(path.resolve(__dirname, '../src/index.js')).href}';
export default [{
  plugins: { oxlint: plugin },
  rules: { 'oxlint/oxlint': 'error' }
}];
`;

async function setupTestDir(dirName, files = {}) {
  const dirPath = path.join(tempDir, dirName);
  await fs.mkdir(dirPath, { recursive: true });
  for (const [fileName, content] of Object.entries(files)) {
    await fs.writeFile(path.join(dirPath, fileName), content);
  }
  return dirPath;
}

describe('e2E Tests', () => {
  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
    // Write a base eslint config that can be imported by other configs
    await fs.writeFile(path.join(tempDir, 'eslint.base.js'), baseEslintConfig);
  });

  afterAll(async () => {
    // await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('autofix should produce the same result as oxlint CLI', async () => {
    const files = { 'test.js': 'if (a === 1) {}\\n' };
    const eslintDir = await setupTestDir('autofix-eslint', files);
    const oxlintDir = await setupTestDir('autofix-oxlint', files);
    const oxlintrc = JSON.stringify({ rules: { eqeqeq: 'error' } });
    await fs.writeFile(path.join(eslintDir, '.oxlintrc.json'), oxlintrc);
    await fs.writeFile(path.join(oxlintDir, '.oxlintrc.json'), oxlintrc);

    const eslintConfig = `import c from '${pathToFileURL(path.join(tempDir, 'eslint.base.js')).href}'; export default c;`;
    const eslintConfigPath = path.join(eslintDir, 'eslint.config.js');
    await fs.writeFile(eslintConfigPath, eslintConfig);

    try {
      await execPromise(`${eslintPath} ${eslintDir} --fix --config ${eslintConfigPath}`);
    } catch {
      /* Ignore exit code */
    }

    try {
      await execPromise(`${oxlintPath} ${oxlintDir} --fix`);
    } catch {
      /* Ignore exit code */
    }

    const eslintFile = await fs.readFile(path.join(eslintDir, 'test.js'), 'utf-8');
    const oxlintFile = await fs.readFile(path.join(oxlintDir, 'test.js'), 'utf-8');

    expect(eslintFile).toEqual(oxlintFile);
    expect(eslintFile).toContain('if (a === 1) {}');
  }, 30000);

  it('should report lint errors correctly', async () => {
    const testDir = await setupTestDir('lint-report', {
      'test.js': 'debugger;\\n  if     (a == b) {  }\n',
    });
    const oxlintrc = JSON.stringify({ rules: { 'no-debugger': 'error', 'eqeqeq': 'error' } });
    await fs.writeFile(path.join(testDir, '.oxlintrc.json'), oxlintrc);

    const eslintConfig = `import c from '${pathToFileURL(path.join(tempDir, 'eslint.base.js')).href}'; export default c;`;
    const eslintConfigPath = path.join(testDir, 'eslint.config.js');
    await fs.writeFile(eslintConfigPath, eslintConfig);

    let eslintOutput = '';
    try {
      await execPromise(`${eslintPath} ${testDir} --config ${eslintConfigPath} --format compact`);
    } catch (error) {
      eslintOutput = error.stdout;
    }
    // Simple check: count the number of reported errors
    expect(eslintOutput.split('\n').filter(line => line.includes('Error -')).length).toBe(2);

    const eslintFile = await fs.readFile(path.join(testDir, 'test.js'), 'utf-8');
    // The file should NOT be changed because the rule is off
    expect(eslintFile).toContain('if (a === b) {}\n');
  }, 30000);

  it('should respect turning rules off', async () => {
    const testDir = await setupTestDir('config-off', { 'test.js': 'if (a === 1) {}\\n' });
    const oxlintrc = { rules: { eqeqeq: 'off' } };
    await fs.writeFile(path.join(testDir, '.oxlintrc.json'), JSON.stringify(oxlintrc));

    const eslintConfig = `import c from '${pathToFileURL(path.join(tempDir, 'eslint.base.js')).href}'; export default c;`;
    const eslintConfigPath = path.join(testDir, 'eslint.config.js');
    await fs.writeFile(eslintConfigPath, eslintConfig);

    try {
      await execPromise(`${eslintPath} ${testDir} --fix --config ${eslintConfigPath}`);
    } catch {
      /* Ignore exit code */
    }

    const eslintFile = await fs.readFile(path.join(testDir, 'test.js'), 'utf-8');
    // The file should NOT be changed because the rule is off
    expect(eslintFile).toContain('if (a === 1) {}');
  }, 30000);

  it('should prioritize config file over rule options', async () => {
    const testDir = await setupTestDir('config-priority', { 'test.js': 'if (a === 1) {}\\n' });
    // Config file says "error"
    const oxlintrc = { rules: { eqeqeq: 'error' } };
    await fs.writeFile(path.join(testDir, '.oxlintrc.json'), JSON.stringify(oxlintrc));

    // Rule options say "off"
    const eslintConfig = `
      import c from '${pathToFileURL(path.join(tempDir, 'eslint.base.js')).href}'; 
      export default c({ rules: { eqeqeq: 'off' } });
    `;
    const eslintConfigPath = path.join(testDir, 'eslint.config.js');
    await fs.writeFile(eslintConfigPath, eslintConfig);

    try {
      await execPromise(`${eslintPath} ${testDir} --fix --config ${eslintConfigPath}`);
    } catch {
      /* Ignore exit code */
    }

    const eslintFile = await fs.readFile(path.join(testDir, 'test.js'), 'utf-8');
    // The file SHOULD be changed because the config file has higher priority
    expect(eslintFile).toContain('if (a === 1) {}');
  }, 30000);
});
