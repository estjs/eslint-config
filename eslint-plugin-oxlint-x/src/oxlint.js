import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const oxlintPath = join(__dirname, '..', 'node_modules', 'oxlint', 'bin', 'oxlint');

function getRandomFileName(originalPath) {
  const extension = originalPath.slice(originalPath.lastIndexOf('.'));
  return `.oxlint-temp-${randomBytes(16).toString('hex')}${extension}`;
}

async function findNearestOxlintrc(startPath) {
  let currentDir = dirname(startPath);
  while (true) {
    const configPath = join(currentDir, '.oxlintrc.json');
    try {
      await fs.access(configPath);
      return configPath;
    } catch {
      // Not found, go up
    }
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return null; // Reached root
    }
    currentDir = parentDir;
  }
}

function mergeConfigs(optionsConfig, fileConfig) {
  // fileConfig has priority
  const merged = { ...optionsConfig, ...fileConfig };
  if (optionsConfig.rules || fileConfig.rules) {
    merged.rules = {
      ...(optionsConfig.rules || {}),
      ...(fileConfig.rules || {}),
    };
  }
  return merged;
}

/**
 * @param {string} code
 * @param {string} filePath
 * @param {object} options
 * @returns {Promise<string>}
 */
export async function format(code, filePath, options = {}) {
  const realConfigPath = await findNearestOxlintrc(filePath);
  let fileConfig = {};
  if (realConfigPath) {
    try {
      fileConfig = JSON.parse(await fs.readFile(realConfigPath, 'utf-8'));
    } catch {
      /* ignore parse errors */
    }
  }

  const mergedConfig = mergeConfigs(options, fileConfig);

  const tempDir = dirname(filePath);
  const tempFileName = getRandomFileName(filePath);
  const tempFilePath = join(tempDir, tempFileName);
  const tempConfigPath = join(tempDir, `.oxlintrc.${tempFileName}.json`);

  await fs.writeFile(tempFilePath, code);
  await fs.writeFile(tempConfigPath, JSON.stringify(mergedConfig));

  return new Promise((resolve, reject) => {
    const args = ['--fix', '--config', tempConfigPath, tempFilePath];

    if (mergedConfig['deny-warnings']) {
      args.push('--deny-warnings');
    }

    const process = spawn(oxlintPath, args, {
      // stdio: ['ignore', 'ignore', 'ignore'],
      // windowsHide: true,
      stdio: 'inherit',
    });

    process.on('close', async () => {
      try {
        const fixedCode = await fs.readFile(tempFilePath, 'utf-8');
        resolve(fixedCode);
      } catch (error) {
        reject(error);
      } finally {
        // await Promise.all([fs.unlink(tempFilePath), fs.unlink(tempConfigPath)]).catch(() => {});
      }
    });

    process.on('error', err => {
      // Promise.all([fs.unlink(tempFilePath), fs.unlink(tempConfigPath)]).finally(() => reject(err));
    });
  });
}
