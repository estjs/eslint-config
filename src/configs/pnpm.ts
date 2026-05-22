import type { Linter } from 'eslint';
import { parserJsonc, parserYml, pluginPnpm } from '../plugins';
import { normalizeRules } from '../shared';
import type { FlatConfig, PnpmRulesOverride } from '../types';

export interface PnpmOptions {
  rules?: PnpmRulesOverride;
}

export function pnpm(options: PnpmOptions = {}): FlatConfig[] {
  const { rules = {} } = options;
  const jsonRules = normalizeRules(rules.json, 'pnpm');
  const yamlRules = normalizeRules(rules.yaml, 'pnpm');

  return [
    {
      name: 'estjs/pnpm/ignores',
      ignores: ['**/node_modules/**', '**/dist/**'],
    },
    {
      name: 'estjs/pnpm/package-json',
      files: ['package.json', '**/package.json'],
      languageOptions: {
        parser: parserJsonc as Linter.Parser,
      },
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/json-enforce-catalog': 'error',
        'pnpm/json-prefer-workspace-settings': 'error',
        'pnpm/json-valid-catalog': 'error',
        ...jsonRules,
      },
    },
    {
      name: 'estjs/pnpm/workspace-yaml',
      files: ['pnpm-workspace.yaml'],
      languageOptions: {
        parser: parserYml as Linter.Parser,
      },
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/yaml-no-unused-catalog-item': 'error',
        'pnpm/yaml-no-duplicate-catalog-item': 'error',
        'pnpm/yaml-valid-packages': 'error',
        ...yamlRules,
      },
    },
  ];
}
