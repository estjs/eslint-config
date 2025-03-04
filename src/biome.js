import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
// Run biome format
export function runBiomeFormat(paths = ['.'], biomeConfig = {}) {
  const currentDir = process.cwd();
  const biomePath = path.join(currentDir, 'node_modules', '.bin', 'biome');
  if (!fs.existsSync(biomePath)) {
    return;
  }

  // Parse command line arguments
  const args = process.argv.slice(2);
  const flags = {
    // Basic parameters
    fix: args.includes('--fix'),
    quiet: args.includes('--quiet'),

    // Output related
    format: args.some(arg => arg === '-f' || arg === '--format')
      ? args[args.findIndex(arg => arg === '-f' || arg === '--format') + 1]
      : null,
    outputFile: args.some(arg => arg === '-o' || arg === '--output-file')
      ? args[args.findIndex(arg => arg === '-o' || arg === '--output-file') + 1]
      : null,

    // Diagnostics and logging related
    maxDiagnostics: args.find(arg => arg.startsWith('--max-diagnostics='))?.split('=')[1],
    diagnosticLevel: args.find(arg => arg.startsWith('--diagnostic-level='))?.split('=')[1],
    logLevel: args.find(arg => arg.startsWith('--log-level='))?.split('=')[1],
    reporter: args.find(arg => arg.startsWith('--reporter='))?.split('=')[1],

    // Other options
    debug: args.includes('--debug'),
    noColor: args.includes('--no-color'),
    skipErrors: args.includes('--skip-errors'),
    errorOnWarnings: args.includes('--error-on-warnings'),
  };

  const tempConfigPath = path.join(currentDir, `.biome.${Date.now()}.json`);
  try {
    fs.writeFileSync(tempConfigPath, JSON.stringify(biomeConfig), 'utf-8');

    // Build biome command arguments
    const biomeArgs = [
      'check',
      '--fix',
      '--unsafe',
      '--formatter-enabled=true',
      '--config-path',
      tempConfigPath,

      // Output format support
      ...(flags.reporter ? [`--reporter=${flags.reporter}`] : []),
      ...(flags.logLevel ? [`--log-level=${flags.logLevel}`] : []),

      // Diagnostics related
      ...(flags.maxDiagnostics ? [`--max-diagnostics=${flags.maxDiagnostics}`] : []),
      ...(flags.diagnosticLevel ? [`--diagnostic-level=${flags.diagnosticLevel}`] : []),

      // Error handling
      ...(flags.skipErrors ? ['--skip-errors'] : []),
      ...(flags.errorOnWarnings ? ['--error-on-warnings'] : []),

      // Debug support
      ...(flags.debug ? ['--verbose'] : []),

      // Color support
      ...(flags.noColor ? ['--colors=off'] : []),
    ].filter(Boolean);

    // Execute command
    execSync(`${biomePath} ${biomeArgs.join(' ')}`, {
      stdio: flags.debug ? 'inherit' : 'pipe',
      env: process.env,
    });
  } catch (error) {
    if (!flags.quiet) {
      console.error('Biome formatting failed:', error.message);
    }
    // Exit based on error level
    if (flags.errorOnWarnings) {
      process.exit(1);
    }
  } finally {
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }
  }
}
