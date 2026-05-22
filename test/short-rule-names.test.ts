import { describe, expect, it } from 'vitest';
import { defineConfig } from '../src/index';
import type { FlatConfig } from '../src/index';

type RuleValue = FlatConfig['rules'] extends infer R
  ? R extends Record<string, infer V>
    ? V
    : never
  : never;

function findRules(configs: FlatConfig[], ruleId: string): RuleValue[] {
  const values: RuleValue[] = [];

  for (const config of configs) {
    if (!config.rules) continue;
    if (Object.prototype.hasOwnProperty.call(config.rules, ruleId)) {
      values.push(config.rules[ruleId] as RuleValue);
    }
  }

  return values;
}

describe('short rule names', () => {
  it('maps bare rule names to their plugin-prefixed ids and keeps explicit prefixes', () => {
    const configs = defineConfig({
      markdown: false,
      node: false,
      pnpm: false,
      prettier: false,
      react: true,
      regexp: true,
      test: true,
      typescript: true,
      unocss: false,
      vue: true,
      rules: {
        comments: { 'disable-enable-pair': 'warn' },
        imports: { 'no-default-export': 'error' },
        jsdoc: { 'check-access': 'off' },
        react: { 'no-array-index-key': 'off' },
        regexp: { 'no-empty-capturing-group': 'warn' },
        test: { 'no-conditional-expect': 'off' },
        typescript: {
          '@typescript-eslint/no-use-before-define': 'warn',
          'no-unused-vars': 'error',
        },
        unicorn: { 'filename-case': 'off' },
        vue: { 'html-self-closing': 'warn' },
      },
    });

    expect(findRules(configs, '@eslint-community/eslint-comments/disable-enable-pair')).toContain(
      'warn',
    );
    expect(findRules(configs, 'import/no-default-export')).toContain('error');
    expect(findRules(configs, 'jsdoc/check-access')).toContain('off');
    expect(findRules(configs, '@eslint-react/no-array-index-key')).toContain('off');
    expect(findRules(configs, 'regexp/no-empty-capturing-group')).toContain('warn');
    expect(findRules(configs, 'vitest/no-conditional-expect')).toContain('off');
    expect(findRules(configs, '@typescript-eslint/no-unused-vars')).toContain('error');
    expect(findRules(configs, '@typescript-eslint/no-use-before-define')).toContain('warn');
    expect(findRules(configs, 'unicorn/filename-case')).toContain('off');
    expect(findRules(configs, 'vue/html-self-closing')).toContain('warn');
  });

  it('maps bare pnpm rule names within yaml and json groups', () => {
    const configs = defineConfig({
      markdown: false,
      node: false,
      pnpm: true,
      prettier: false,
      react: false,
      regexp: false,
      test: false,
      typescript: false,
      unocss: false,
      vue: false,
      rules: {
        pnpm: {
          json: { 'json-enforce-catalog': 'warn' },
          yaml: { 'yaml-no-unused-catalog-item': 'off' },
        },
      },
    });

    expect(findRules(configs, 'pnpm/json-enforce-catalog')).toContain('warn');
    expect(findRules(configs, 'pnpm/yaml-no-unused-catalog-item')).toContain('off');
  });

  it('keeps fully-prefixed rule names for command and pnpm groups untouched', () => {
    const configs = defineConfig({
      markdown: false,
      node: false,
      pnpm: true,
      prettier: false,
      react: false,
      regexp: false,
      test: false,
      typescript: false,
      unocss: false,
      vue: false,
      rules: {
        command: { 'command/command': 'off' },
        pnpm: {
          json: { 'pnpm/json-valid-catalog': 'warn' },
        },
      },
    });

    expect(findRules(configs, 'command/command')).toContain('off');
    expect(findRules(configs, 'pnpm/json-valid-catalog')).toContain('warn');
  });
});
