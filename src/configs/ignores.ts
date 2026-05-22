import { GLOB_EXCLUDE } from '../globs';
import type { FlatConfig } from '../types';

export interface IgnoresOptions {
  ignores?: string[];
}

/**
 * Top-level ignore patterns. Accepts either an options object or a bare string array
 * (the latter is kept for ergonomic call-sites).
 */
export function ignores(options: IgnoresOptions | string[] = {}): FlatConfig[] {
  const userIgnores = Array.isArray(options) ? options : (options.ignores ?? []);

  return [
    {
      name: 'estjs/ignores',
      ignores: [...GLOB_EXCLUDE, ...userIgnores],
    },
  ];
}
