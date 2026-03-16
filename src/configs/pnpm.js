import { parserJsonc, parserYml, pluginPnpm } from '../plugins';
export function pnpm(override = { yaml: {}, json: {} }) {
  return [
    {
      ignores: ['**/node_modules/**', '**/dist/**'],
    },
    {
      files: ['package.json', '**/package.json'],
      languageOptions: {
        parser: parserJsonc,
      },
      name: 'pnpm/package.json',
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/json-enforce-catalog': 'error',
        'pnpm/json-prefer-workspace-settings': 'error',
        'pnpm/json-valid-catalog': 'error',
        ...override.json,
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      languageOptions: {
        parser: parserYml,
      },
      name: 'pnpm/pnpm-workspace-yaml',
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        'pnpm/yaml-no-unused-catalog-item': 'error',
        'pnpm/yaml-no-duplicate-catalog-item': 'error',
        'pnpm/yaml-valid-packages': 'error',
        ...override.yaml,
      },
    },
  ];
}
