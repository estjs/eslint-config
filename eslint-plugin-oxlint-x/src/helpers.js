import { join } from 'node:path';
import fs from 'node:fs';
import process from 'node:process';
import diff from 'fast-diff';

const LINE_ENDING_RE = /\r\n|[\n\r\u2028\u2029]/;

/**
 * Converts invisible characters to a commonly recognizable visible form.
 * @param {string} str - The string with invisibles to convert.
 * @returns {string} The converted string.
 */
export function showInvisibles(str) {
  let ret = '';
  for (const element of str) {
    switch (element) {
      case ' ':
        ret += '·'; // Middle Dot, \u00B7
        break;
      case '\n':
        ret += '⏎'; // Return Symbol, \u23ce
        break;
      case '\t':
        ret += '↹'; // Left Arrow To Bar Over Right Arrow To Bar, \u21b9
        break;
      case '\r':
        ret += '␍'; // Carriage Return Symbol, \u240D
        break;
      default:
        ret += element;
        break;
    }
  }
  return ret;
}

/**
 * Generate results for differences between source code and formatted version.
 *
 * @param {string} source - The original source.
 * @param {string} oxlintSource - The oxlint formatted source.
 * @returns {Array} - An array containing { operation, offset, insertText, deleteText }
 */
export function generateDifferences(source, oxlintSource) {
  // fast-diff returns the differences between two texts as a series of
  // INSERT, DELETE or EQUAL operations. The results occur only in these
  // sequences:
  //           /-> INSERT -> EQUAL
  //    EQUAL |           /-> EQUAL
  //           \-> DELETE |
  //                      \-> INSERT -> EQUAL
  // Instead of reporting issues at each INSERT or DELETE, certain sequences
  // are batched together and are reported as a friendlier "replace" operation:
  // - A DELETE immediately followed by an INSERT.
  // - Any number of INSERTs and DELETEs where the joining EQUAL of one's end
  // and another's beginning does not have line endings (i.e. issues that occur
  // on contiguous lines).

  const results = diff(source, oxlintSource);
  const differences = [];

  const batch = [];
  let offset = 0; // NOTE: INSERT never advances the offset.
  while (results.length > 0) {
    const result = results.shift();
    const op = result[0];
    const text = result[1];
    switch (op) {
      case diff.INSERT:
      case diff.DELETE:
        batch.push(result);
        break;
      case diff.EQUAL:
        if (results.length > 0) {
          if (batch.length > 0) {
            if (LINE_ENDING_RE.test(text)) {
              flush();
              offset += text.length;
            } else {
              batch.push(result);
            }
          } else {
            offset += text.length;
          }
        }
        break;
      default:
        throw new Error(`Unexpected fast-diff operation "${op}"`);
    }
    if (batch.length > 0 && results.length === 0) {
      flush();
    }
  }

  return differences;

  function flush() {
    let aheadDeleteText = '';
    let aheadInsertText = '';
    while (batch.length > 0) {
      const next = batch.shift();
      const op = next[0];
      const text = next[1];
      switch (op) {
        case diff.INSERT:
          aheadInsertText += text;
          break;
        case diff.DELETE:
          aheadDeleteText += text;
          break;
        case diff.EQUAL:
          aheadDeleteText += text;
          aheadInsertText += text;
          break;
      }
    }
    if (aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences.REPLACE,
        insertText: aheadInsertText,
        deleteText: aheadDeleteText,
      });
    } else if (!aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences.INSERT,
        insertText: aheadInsertText,
      });
    } else if (aheadDeleteText && !aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences.DELETE,
        deleteText: aheadDeleteText,
      });
    }
    offset += aheadDeleteText.length;
  }
}

generateDifferences.INSERT = 'insert';
generateDifferences.DELETE = 'delete';
generateDifferences.REPLACE = 'replace';

/**
 * 读取 .eslintignore 文件并转换为 oxlint 支持的 ignorePatterns 格式
 * @returns {string[]} - 忽略文件模式数组
 */
export function readEslintIgnore() {
  const currentDir = process.cwd();
  const eslintIgnorePath = join(currentDir, '.eslintignore');
  const patterns = [];

  if (fs.existsSync(eslintIgnorePath)) {
    try {
      const content = fs.readFileSync(eslintIgnorePath, 'utf8');
      const lines = content.split('\n');

      // 处理每一行 (移除注释和空行)
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          patterns.push(trimmedLine);
        }
      }
    } catch (error) {
      console.warn('警告: 读取 .eslintignore 失败', error.message);
    }
  }

  return patterns;
}

/**
 * 深度合并两个配置对象
 * @param {object} target - 目标配置
 * @param {object} source - 源配置
 * @returns {object} - 合并后的配置
 */
export function deepMergeConfig(target = {}, source = {}) {
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
export function resolveOxlintBinary() {
  const current = process.cwd();
  const candidate = join(
    current,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'oxlint.cmd' : 'oxlint',
  );

  return candidate;
}

export function findNearestOxlintrc() {
  const currentDir = process.cwd();
  const configPath = join(currentDir, '.oxlintrc.json');
  return configPath;
}

export const configFileName = '.oxlintrc.eslint-plugin-oxlint-x.temp.json';

export function createOrFindConfigFile(innerConfig) {
  const currentDir = process.cwd();
  const configPath = join(currentDir, 'node_modules');

  const tempConfigPath = join(configPath, configFileName);
  fs.writeFileSync(tempConfigPath, JSON.stringify(innerConfig), 'utf8');

  return tempConfigPath;
}

export function getConfig(oxlintConfig = {}) {
  const currentDir = process.cwd();
  let fileConfig = {};

  const configPath = findNearestOxlintrc();

  if (configPath) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
      // console.info('未找到 .oxlintrc.json，使用空配置', error.message);
    }
  }
  // 添加对 .eslintignore 的支持
  const eslintIgnorePatterns = readEslintIgnore(currentDir);
  fileConfig.ignorePatterns = [
    ...(fileConfig.ignorePatterns || []),
    ...(eslintIgnorePatterns || []),
  ];

  // 使用深度合并策略
  const mergedConfig = deepMergeConfig(fileConfig, oxlintConfig);
  console.log('mergedConfig', mergedConfig);

  return createOrFindConfigFile(mergedConfig);
}
