import type { Linter } from 'eslint';

/**
 * Resolve CJS/ESM interop: prefer the `default` export when present.
 */
export function interopDefault<T>(input: T | { default: T }): T {
  return (input as { default?: T }).default ?? (input as T);
}

/**
 * Normalise an overrides record so every rule id carries the plugin prefix. Entries that
 * already include any `/` are passed through unchanged. Used to accept both
 * `{ 'no-unused-vars': 'off' }` and `{ '@typescript-eslint/no-unused-vars': 'off' }`.
 */
export function normalizeRules(
  rules: Record<string, unknown> | undefined,
  prefix: string,
): Linter.RulesRecord {
  const input = (rules ?? {}) as Linter.RulesRecord;
  if (!prefix) return { ...input };

  const normalized: Linter.RulesRecord = {};
  for (const [key, value] of Object.entries(input)) {
    normalized[key.includes('/') ? key : `${prefix}/${key}`] = value;
  }
  return normalized;
}

/**
 * Lower the severity of every rule in `rules` whose entry is `'error'` to `'warn'`.
 * Used to keep recommended sets opinionated but non-blocking.
 */
export function downgradeErrorsToWarn(rules: Linter.RulesRecord): Linter.RulesRecord {
  const out: Linter.RulesRecord = {};
  for (const [name, entry] of Object.entries(rules)) {
    out[name] = entry === 'error' ? 'warn' : entry;
  }
  return out;
}
