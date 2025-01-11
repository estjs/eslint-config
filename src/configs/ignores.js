import { GLOB_EXCLUDE } from '../globs';

export function ignores(userIgores = []) {
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...userIgores],
    },
  ];
}
