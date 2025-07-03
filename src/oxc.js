import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/**
 * 读取 .eslintignore 文件并转换为 oxlint 支持的 ignorePatterns 格式
 * @param {string} currentDir - 当前工作目录
 * @returns {string[]} - 忽略文件模式数组
 */
function readEslintIgnore(currentDir) {
  const eslintIgnorePath = path.join(currentDir, '.eslintignore');
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
 * 特殊处理 rules、ignorePatterns、globals、env、plugins 等字段
 * @param {object} target - 目标配置对象
 * @param {object} source - 源配置对象
 * @returns {object} - 合并后的配置对象
 */
function deepMergeConfig(target = {}, source = {}) {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (key === 'rules' && target.rules && source.rules) {
        // 合并规则 (源优先)
        result.rules = {
          ...target.rules,
          ...source.rules,
        };
      } else if (key === 'ignorePatterns' && Array.isArray(target.ignorePatterns) && Array.isArray(source.ignorePatterns)) {
        // 合并忽略模式 (不重复)
        result.ignorePatterns = [...new Set([...target.ignorePatterns, ...source.ignorePatterns])];
      } else if (key === 'plugins' && Array.isArray(target.plugins) && Array.isArray(source.plugins)) {
        // 合并插件 (不重复)
        result.plugins = [...new Set([...target.plugins, ...source.plugins])];
      } else if (key === 'globals' && target.globals && source.globals) {
        // 合并全局变量 (源优先)
        result.globals = {
          ...target.globals,
          ...source.globals,
        };
      } else if (key === 'env' && target.env && source.env) {
        // 合并环境 (源优先)
        result.env = {
          ...target.env,
          ...source.env,
        };
      } else if (key === 'categories' && target.categories && source.categories) {
        // 合并类别 (源优先)
        result.categories = {
          ...target.categories,
          ...source.categories,
        };
      } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        // 递归合并其它对象
        result[key] = deepMergeConfig(target[key], source[key]);
      } else {
        // 其它情况直接覆盖
        result[key] = source[key];
      }
    }
  }

  return result;
}

// Run oxlint format
//
// This method mirrors the behaviour of `runBiomeFormat` that previously existed in this
// project, providing the following capabilities:
//   1. Read the nearest `.oxlintrc.json` in the project root (if any)
//   2. Accept an in-memory `oxlintConfig` object which will be merged over the file config
//   3. Distinguish between formatting the whole project and formatting specific paths
//   4. Respect common CLI flags such as `--fix`, `--deny-warnings`, and path globs
//
// Pass `oxlintConfig` if you want to configure oxlint programmatically when calling via
// `estjs()`.
export function runOxlintFormat(oxlintConfig = {}) {
  const currentDir = process.cwd();

  const oxlintPath = path.join(currentDir, 'node_modules', '.bin', 'oxlint');
  if (!fs.existsSync(oxlintPath)) {
    // oxlint is not installed – silently abort.
    return;
  }

  // ---------------------------
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
  // 2.  Read disk config and merge with passed config
  // ------------------------------------------------
  const configPathOnDisk = path.join(currentDir, '.oxlintrc.json');
  let fileConfig = {};
  if (fs.existsSync(configPathOnDisk)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(configPathOnDisk, 'utf8'));
    } catch {
      // ignore malformed config – oxlint will throw later with better diagnostics
    }
  }

  // 添加对 .eslintignore 的支持
  const eslintIgnorePatterns = readEslintIgnore(currentDir);
  if (eslintIgnorePatterns.length > 0) {
    // 如果已有 ignorePatterns，则合并；否则创建
    if (fileConfig.ignorePatterns) {
      fileConfig.ignorePatterns = [...fileConfig.ignorePatterns, ...eslintIgnorePatterns];
    } else {
      fileConfig.ignorePatterns = eslintIgnorePatterns;
    }
  }

  // 使用深度合并策略
  const mergedConfig = deepMergeConfig(fileConfig, oxlintConfig);

  // 如果传入的配置包含 denyWarnings 或 deny-warnings，则设置命令行参数
  if (!denyWarnings && (mergedConfig.denyWarnings === true || mergedConfig['deny-warnings'] === true)) {
    mergedConfig['deny-warnings'] = true;
  }

  // If the merged config is identical to the on-disk config we can simply rely on oxlint's
  // default lookup logic; otherwise we write a temporary config and pass `--config`.
  let extraConfigArgs = [];
  let tempConfigPath;
  try {
    const mergedJson = JSON.stringify(mergedConfig);
    const originalJson = JSON.stringify(fileConfig);

    if (mergedJson !== originalJson || !fs.existsSync(configPathOnDisk)) {
      tempConfigPath = path.join(
        currentDir,
        `.oxlintrc.temp.${Date.now()}.json`,
      );
      fs.writeFileSync(tempConfigPath, mergedJson, 'utf8');
      extraConfigArgs.push('--config', tempConfigPath);
    }
  } catch {
    // fallback – if we cannot stringify/merge we skip passing config
  }

  // -----------------------------
  // 3.  Assemble final CLI params
  // -----------------------------
  const cliArgs = [];

  if (shouldFix) cliArgs.push('--fix');
  if (denyWarnings || mergedConfig['deny-warnings'] === true || mergedConfig.denyWarnings === true) {
    cliArgs.push('--deny-warnings');
  }

  cliArgs.push(...extraConfigArgs);
  cliArgs.push(...targetPaths);

  // ---------------------------
  // 4.  Execute oxlint process
  // ---------------------------
  try {
    execSync(`${oxlintPath} ${cliArgs.join(' ')}`, {
      stdio: 'inherit',
      env: process.env,
    });
  } finally {
    if (tempConfigPath && fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }
  }
} 
