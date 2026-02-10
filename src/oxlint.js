import { createSyncFn } from 'synckit';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { deepmerge } from 'deepmerge-ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runOxlintWorker = createSyncFn(path.join(__dirname, 'oxlint-worker.js'));

/**
 * Get unified Oxlint configuration (file + overrides)
 * @param {object} overrides - Configuration overrides
 * @returns {{mergedConfig: object, configPath: string|null, hasConfigFile: boolean}} Unified configuration object
 */
export function getOxlintConfig(overrides = {}) {
  const currentDir = process.cwd();
  const configFiles = ['.oxlintrc.json', '.oxlintrc'];
  let fileConfig = {};
  let configPath = null;

  for (const file of configFiles) {
    const p = path.join(currentDir, file);
    if (fs.existsSync(p)) {
      configPath = p;
      try {
        const content = fs.readFileSync(p, 'utf-8');
        fileConfig = JSON.parse(content);
      } catch (error) {
        console.warn(`Warning: Failed to parse ${file}: ${error.message}`);
      }
      break;
    }
  }

  const mergedConfig = deepmerge(fileConfig, overrides);
  return { mergedConfig, configPath, hasConfigFile: !!configPath };
}

/**
 * Load oxlint configuration from .oxlintrc.json
 * @returns {object} Oxlint configuration
 */
export const loadOxlintConfig = getOxlintConfig().mergedConfig;

/**
 * Run oxlint format/check on all files
 * @param {object} options - Configuration object or options object
 * @param {object} [options.config] - Oxlint configuration object
 * @param {string[]} [options.ignorePatterns] - Patterns to ignore
 * @param {string} [options.ignorePath] - Path to ignore file
 */
export function runOxlintFormat(options = {}) {
  const currentDir = process.cwd();

  // Handle both old signature (oxlintConfig) and new options object
  const isOptionsObject =
    'config' in options || 'ignorePatterns' in options || 'ignorePath' in options;
  const oxlintConfig = isOptionsObject ? options.config || {} : options;
  const ignorePatterns = options.ignorePatterns || [];
  const ignorePath = options.ignorePath;

  // Use npx by default as it works across all package managers (npm, pnpm, yarn)
  let oxlintPath = 'npx oxlint';

  // Alternatively, try to find the binary directly for better performance
  const possiblePaths = [
    path.join(currentDir, 'node_modules', '.bin', 'oxlint'),
    path.join(currentDir, 'node_modules', 'oxlint', 'bin', 'oxlint'),
    path.join(currentDir, 'node_modules', '.bin', 'oxlint.cmd'),
  ];

  // Windows support for binary lookup
  if (process.platform === 'win32') {
    possiblePaths.push(path.join(currentDir, 'node_modules', '.bin', 'oxlint.exe'));
  }

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      oxlintPath = testPath;
      break;
    }
  }

  // Parse command line arguments
  const args = process.argv.slice(2);
  const flags = {
    // Fix options
    fix: args.includes('--fix'),
    fixSuggestions: args.includes('--fix-suggestions'),
    fixDangerously: args.includes('--fix-dangerously'),

    // Target paths (all non-flag arguments)
    paths: args.filter(arg => !arg.startsWith('-')),

    // Output format
    format:
      args.find(arg => arg.startsWith('--format='))?.split('=')[1] ||
      args.find(arg => arg.startsWith('-f='))?.split('=')[1] ||
      'stylish', // default to stylish for better readability

    // Config file
    config: args.find(arg => arg.startsWith('--config=') || arg.startsWith('-c='))?.split('=')[1],
    tsconfig: args.find(arg => arg.startsWith('--tsconfig='))?.split('=')[1],

    // Rule categories
    allow: args
      .filter(arg => arg.startsWith('-A=') || arg.startsWith('--allow='))
      .map(arg => arg.split('=')[1]),
    warn: args
      .filter(arg => arg.startsWith('-W=') || arg.startsWith('--warn='))
      .map(arg => arg.split('=')[1]),
    deny: args
      .filter(arg => arg.startsWith('-D=') || arg.startsWith('--deny='))
      .map(arg => arg.split('=')[1]),

    // Plugins
    importPlugin: args.includes('--import-plugin'),
    reactPlugin: args.includes('--react-plugin'),
    jsdocPlugin: args.includes('--jsdoc-plugin'),
    jestPlugin: args.includes('--jest-plugin'),
    vitestPlugin: args.includes('--vitest-plugin'),
    jsxA11yPlugin: args.includes('--jsx-a11y-plugin'),
    nextjsPlugin: args.includes('--nextjs-plugin'),
    reactPerfPlugin: args.includes('--react-perf-plugin'),
    promisePlugin: args.includes('--promise-plugin'),
    nodePlugin: args.includes('--node-plugin'),
    vuePlugin: args.includes('--vue-plugin'),

    // Disable plugins
    disableUnicorn: args.includes('--disable-unicorn-plugin'),
    disableOxc: args.includes('--disable-oxc-plugin'),
    disableTypescript: args.includes('--disable-typescript-plugin'),

    // Ignore options
    ignorePath: args.find(arg => arg.startsWith('--ignore-path='))?.split('=')[1],
    ignorePattern: args
      .filter(arg => arg.startsWith('--ignore-pattern='))
      .map(arg => arg.split('=')[1]),
    noIgnore: args.includes('--no-ignore'),

    // Warning handling
    quiet: args.includes('--quiet'),
    denyWarnings: args.includes('--deny-warnings'),
    maxWarnings: args.find(arg => arg.startsWith('--max-warnings='))?.split('=')[1],

    // Miscellaneous
    silent: args.includes('--silent'),
    threads: args.find(arg => arg.startsWith('--threads='))?.split('=')[1],
    printConfig: args.includes('--print-config'),

    // Inline configuration
    reportUnusedDisableDirectives: args.includes('--report-unused-disable-directives'),
    reportUnusedDisableDirectivesSeverity: args
      .find(arg => arg.startsWith('--report-unused-disable-directives-severity='))
      ?.split('=')[1],

    // Advanced options
    disableNestedConfig: args.includes('--disable-nested-config'),
    typeAware: args.includes('--type-aware'),
    typeCheck: args.includes('--type-check'),
  };

  // Create temporary config file if config object is provided
  let tempConfigPath = null;
  if (Object.keys(oxlintConfig).length > 0) {
    tempConfigPath = path.join(currentDir, 'node_modules', `.oxlintrc.${Date.now()}.json`);
    try {
      fs.writeFileSync(tempConfigPath, JSON.stringify(oxlintConfig, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write temporary config file:', error.message);
      return;
    }
  }

  try {
    // Build oxlint command arguments
    const oxlintArgs = [
      // Config files
      ...(tempConfigPath
        ? ['--config', tempConfigPath]
        : flags.config
          ? ['--config', flags.config]
          : []),
      ...(flags.tsconfig ? ['--tsconfig', flags.tsconfig] : []),

      // Fix options
      ...(flags.fix ? ['--fix'] : []),
      ...(flags.fixSuggestions ? ['--fix-suggestions'] : []),
      ...(flags.fixDangerously ? ['--fix-dangerously'] : []),

      // Output format (support ESLint-compatible formats)
      '--format',
      flags.format,

      // Rule categories
      ...flags.allow.flatMap(rule => ['--allow', rule]),
      ...flags.warn.flatMap(rule => ['--warn', rule]),
      ...flags.deny.flatMap(rule => ['--deny', rule]),

      // Enable plugins
      ...(flags.importPlugin ? ['--import-plugin'] : []),
      ...(flags.reactPlugin ? ['--react-plugin'] : []),
      ...(flags.jsdocPlugin ? ['--jsdoc-plugin'] : []),
      ...(flags.jestPlugin ? ['--jest-plugin'] : []),
      ...(flags.vitestPlugin ? ['--vitest-plugin'] : []),
      ...(flags.jsxA11yPlugin ? ['--jsx-a11y-plugin'] : []),
      ...(flags.nextjsPlugin ? ['--nextjs-plugin'] : []),
      ...(flags.reactPerfPlugin ? ['--react-perf-plugin'] : []),
      ...(flags.promisePlugin ? ['--promise-plugin'] : []),
      ...(flags.nodePlugin ? ['--node-plugin'] : []),
      ...(flags.vuePlugin ? ['--vue-plugin'] : []),

      // Disable plugins
      ...(flags.disableUnicorn ? ['--disable-unicorn-plugin'] : []),
      ...(flags.disableOxc ? ['--disable-oxc-plugin'] : []),
      ...(flags.disableTypescript ? ['--disable-typescript-plugin'] : []),

      // Ignore options
      ...(flags.ignorePath
        ? ['--ignore-path', flags.ignorePath]
        : ignorePath
          ? ['--ignore-path', ignorePath]
          : []),
      ...flags.ignorePattern.flatMap(pattern => ['--ignore-pattern', pattern]),
      ...ignorePatterns.flatMap(pattern => ['--ignore-pattern', pattern]),
      ...(flags.noIgnore ? ['--no-ignore'] : []),

      // Warning handling
      ...(flags.quiet ? ['--quiet'] : []),
      ...(flags.denyWarnings ? ['--deny-warnings'] : []),
      ...(flags.maxWarnings ? ['--max-warnings', flags.maxWarnings] : []),

      // Miscellaneous
      ...(flags.silent ? ['--silent'] : []),
      ...(flags.threads ? ['--threads', flags.threads] : []),
      ...(flags.printConfig ? ['--print-config'] : []),

      // Inline configuration
      ...(flags.reportUnusedDisableDirectives ? ['--report-unused-disable-directives'] : []),
      ...(flags.reportUnusedDisableDirectivesSeverity
        ? [
          '--report-unused-disable-directives-severity',
          flags.reportUnusedDisableDirectivesSeverity,
        ]
        : []),

      // Advanced options
      ...(flags.disableNestedConfig ? ['--disable-nested-config'] : []),
      ...(flags.typeAware ? ['--type-aware'] : []),
      ...(flags.typeCheck ? ['--type-check'] : []),

      // Target paths (default to current directory)
      ...(flags.paths.length > 0 ? flags.paths : ['.']),
    ].filter(Boolean);

    // Prepare command and arguments for the worker
    const command = oxlintPath.includes('npx') ? 'npx' : oxlintPath;
    const finalArgs = oxlintPath.includes('npx') ? ['oxlint', ...oxlintArgs] : oxlintArgs;

    // eslint-disable-next-line no-console
    console.log(`Running: oxlint ${oxlintArgs.join(' ')}\n`);

    const result = runOxlintWorker(command, finalArgs, {
      stdio: 'pipe', // Capture output to print it here
      env: process.env,
      shell: true,
      reject: false
    });

    if (result.stdout) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }

    if (result.failed || result.exitCode !== 0) {
      // Oxlint returns non-zero exit code when issues are found
      if (flags.denyWarnings || flags.maxWarnings || result.exitCode !== 0) {
        console.error('\n✗ Oxlint found issues');
        process.exit(result.exitCode || 1);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('\n✓ Oxlint completed successfully');
    }
  } catch (err) {
    console.error('Unexpected error running oxlint:', err);
    process.exit(1);
  } finally {
    // Clean up temporary config file
    if (tempConfigPath && fs.existsSync(tempConfigPath)) {
      try {
        fs.unlinkSync(tempConfigPath);
      } catch (error) {
        console.warn(`Warning: Failed to clean up temporary config file: ${error.message}`);
      }
    }
  }
}

// Run if called directly
if (
  import.meta.url === `file:///${process.argv[1].replaceAll('\\', '/')}` ||
  import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))
) {
  runOxlintFormat();
}
