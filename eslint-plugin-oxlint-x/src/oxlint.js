import { execSync, spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import process from 'node:process';
import { getConfig, resolveOxlintBinary } from './helpers';

export async function format(code, options = {}) {
  const tempConfigPath = getConfig(options);
  const binPath = await resolveOxlintBinary();

  return new Promise((resolve, reject) => {
    const args = [
      'lint',
      '--stdin', // 从标准输入读取内容
      '--fix', // 启用自动修复
      '--silent', // 静默模式，不输出警告和错误
      '--format', // 确保输出修复后的代码
      '--config',
      tempConfigPath,
    ];

    const child = spawn(binPath, args, {
      stdio: 'pipe', // 配置 stdin/stdout/stderr 管道
    });

    let formattedCode = '';

    // 收集修复后的代码
    child.stdout.on('data', chunk => {
      formattedCode += chunk.toString();
    });

    // 写入需要修复的原始代码到 stdin
    child.stdin.write(code); // 传入需要格式化的原始代码
    child.stdin.end(); // 结束输入

    // 处理进程结束
    child.on('close', code => {
      console.log('code', code, 'formattedCode:', formattedCode.trim());

      if (code === 0) {
        resolve(formattedCode.trim()); // 返回修复后的代码
      } else {
        console.log(`Oxc exited with code ${code}`);

        reject(new Error(`Oxc exited with code ${code}`));
      }
    });

    // 处理进程错误
    child.on('error', async err => {
      await fs.unlink(tempConfigPath).catch(() => {});
      console.log(err);

      reject(err);
    });
  });
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
  } finally {
    // Clean up temporary config file
    try {
      await fs.unlink(tempConfigPath);
    } catch (error) {
      console.error(`Failed to remove temporary config file: ${error.message}`);
    }
  }
}
