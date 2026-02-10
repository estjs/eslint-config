import { runAsWorker } from 'synckit';
import { execa } from 'execa';

runAsWorker(async (command, args, options) => {
  try {
    const result = await execa(command, args, options);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      failed: result.failed,
    };
  } catch (error) {
    return {
      stdout: error.stdout,
      stderr: error.stderr,
      exitCode: error.exitCode,
      failed: true,
      message: error.message,
    };
  }
});
