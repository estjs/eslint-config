import { defineConfig } from './dist/index.js';
import type { Linter } from 'eslint';

const config: Linter.Config[] = defineConfig({
  ignores: ['**/fixtures/**'],
});

export default config;
