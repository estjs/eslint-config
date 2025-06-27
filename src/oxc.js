import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

// Run oxlint format
export function runOxlintFormat() {
  const currentDir = process.cwd();
  const oxlintPath = path.join(currentDir, 'node_modules', '.bin', 'oxlint');
  if (!fs.existsSync(oxlintPath)) {
    return;
  }
  execSync(`${oxlintPath} --fix .`, {
    stdio: 'inherit',
    env: process.env,
  });
} 
