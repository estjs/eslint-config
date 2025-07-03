import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * 解析 .eslintignore 文件并添加到配置中
 * @param {string} filePath - 文件路径
 * @param {object} config - 配置对象
 * @returns {Promise<object>} - 更新后的配置对象
 */
async function addEslintIgnore(filePath, config) {
  try {
    const dirPath = dirname(filePath);
    const eslintIgnorePath = join(dirPath, '.eslintignore');
    
    try {
      await fs.access(eslintIgnorePath);
      // 文件存在，读取内容
      const content = await fs.readFile(eslintIgnorePath, 'utf-8');
      const ignorePatterns = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      
      if (ignorePatterns.length) {
        if (!config.ignorePatterns) {
          config.ignorePatterns = ignorePatterns;
        } else if (Array.isArray(config.ignorePatterns)) {
          config.ignorePatterns = [...new Set([...config.ignorePatterns, ...ignorePatterns])];
        }
      }
    } catch {
      // 文件不存在或无法访问，忽略
    }
    
    return config;
  } catch (error) {
    // 出错时返回原配置
    return config;
  }
}

/**
 * 深度合并两个配置对象
 * @param {object} target - 目标配置
 * @param {object} source - 源配置
 * @returns {object} - 合并后的配置
 */
function deepMergeConfig(target = {}, source = {}) {
  const result = { ...target };

  for (const [key, sourceValue] of Object.entries(source)) {
    // 如果键不存在于目标对象中，直接复制
    if (!(key in target)) {
      result[key] = sourceValue;
      continue;
    }

    const targetValue = target[key];

    if (
      typeof sourceValue === 'object' && 
      sourceValue !== null && 
      typeof targetValue === 'object' && 
      targetValue !== null
    ) {
      // 特殊处理数组
      if (Array.isArray(sourceValue)) {
        if (Array.isArray(targetValue)) {
          // 对于plugins和ignorePatterns，去重合并
          if (key === 'plugins' || key === 'ignorePatterns') {
            result[key] = [...new Set([...targetValue, ...sourceValue])];
          } else {
            // 其他数组直接覆盖
            result[key] = sourceValue;
          }
        } else {
          result[key] = sourceValue;
        }
      }
      // 特殊处理规则、环境、全局变量等对象
      else if (['rules', 'env', 'globals', 'categories'].includes(key)) {
        result[key] = { ...targetValue, ...sourceValue };
      }
      // 递归合并其他对象
      else {
        result[key] = deepMergeConfig(targetValue, sourceValue);
      }
    } else {
      // 非对象值直接覆盖
      result[key] = sourceValue;
    }
  }

  return result;
}

/**
 * Resolve the oxlint binary path.
 * 1. Search up from the provided start directory for `node_modules/.bin/oxlint`.
 * 2. Fallback to the binary name (`oxlint`) which relies on the caller's PATH.
 *
 * This makes the plugin resilient whether "oxlint" is installed at project root
 * or hoisted by pnpm/npm workspaces.
 */
async function resolveOxlintBinary(startDir) {
  let current = startDir;
  while (true) {
    const candidate = join(current, 'node_modules', '.bin', process.platform === 'win32' ? 'oxlint.cmd' : 'oxlint');
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* continue searching */
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return 'oxlint'; // rely on PATH
}

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
  // optionsConfig should override fileConfig so that inline rule options take precedence
  return deepMergeConfig(fileConfig, optionsConfig);
}

/**
 * @param {string} code
 * @param {string} filePath
 * @param {object} options
 * @returns {Promise<string>}
 */
export async function format(code, filePath, options = {}) {
  // 查找并读取最近的.oxlintrc.json
  const realConfigPath = await findNearestOxlintrc(filePath);
  let fileConfig = {};
  if (realConfigPath) {
    try {
      fileConfig = JSON.parse(await fs.readFile(realConfigPath, 'utf-8'));
    } catch {
      /* ignore parse errors */
    }
  }

  // 添加.eslintignore支持
  fileConfig = await addEslintIgnore(filePath, fileConfig);
  
  // 合并配置
  const mergedConfig = mergeConfigs(options, fileConfig);

  const tempDir = dirname(filePath);
  const tempFileName = getRandomFileName(filePath);
  const tempFilePath = join(tempDir, tempFileName);
  const tempConfigPath = join(tempDir, `.oxlintrc.${tempFileName}.json`);

  await fs.writeFile(tempFilePath, code);
  await fs.writeFile(tempConfigPath, JSON.stringify(mergedConfig));

  const binPath = await resolveOxlintBinary(tempDir);

  return new Promise((resolve, reject) => {
    const args = ['--fix', '--config', tempConfigPath, tempFilePath];

    if (mergedConfig['deny-warnings'] || mergedConfig['denyWarnings']) {
      args.push('--deny-warnings');
    }

    const process = spawn(binPath, args, {
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
        try {
          // 清理临时文件
          await Promise.all([
            fs.unlink(tempFilePath).catch(() => {}),
            fs.unlink(tempConfigPath).catch(() => {})
          ]);
        } catch {}
      }
    });

    process.on('error', async err => {
      try {
        // 出错时清理临时文件
        await Promise.all([
          fs.unlink(tempFilePath).catch(() => {}),
          fs.unlink(tempConfigPath).catch(() => {})
        ]);
      } finally {
        reject(err);
      }
    });
  });
}
