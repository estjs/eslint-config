import process from 'node:process';
import { describe, expect, it, vi } from 'vitest';
import { estjs } from '../src/presets.js';

// Mock dependencies to avoid runtime errors during config generation
vi.mock('../src/oxlint.js', async () => {
  const actual = await vi.importActual('../src/oxlint.js');
  return {
    ...actual,
    runOxlintFormat: vi.fn(),
  };
});

vi.mock('eslint-plugin-oxlint-x', () => ({
  default: {
    rules: {
      oxlint: { meta: {}, create: () => ({}) },
    },
  },
}));

describe('oxlint config integration', () => {
  it('should not perform oxlint logic if oxlint is false (default)', () => {
    const specs = estjs({ oxlint: false });
    // check that no oxlint plugins or rules are present
    const hasOxlint = specs.some(
      config => config.name === 'oxlint/plugin' || (config.plugins && config.plugins.oxlint),
    );
    expect(hasOxlint).toBe(false);
  });

  it('should enable oxlint plugin and disable conflicting rules when oxlint: true', () => {
    const originalArgv = process.argv;
    process.argv = [...process.argv, '--node-ipc']; // Simulate local mode
    const specs = estjs({}, { oxlint: true });
    process.argv = originalArgv;

    // Check for oxlint plugin presence
    const oxlintPluginConfig = specs.find(config => config.name === 'oxlint/plugin');
    expect(oxlintPluginConfig).toBeDefined();

    // Check that 'eslint-plugin-oxlint' recommended rules are included (which turn off rules)
    // usually they are in a separate config object, or merged.
    // estjs logic:
    // return [ ..., { name: 'oxlint/plugin', ... }, ...officialConfig ]
    // officialConfig is pluginOxlint.configs['flat/recommended'] which is array or object.

    // Let's find a rule that oxlint turns off.
    // e.g. 'no-const-assign', 'no-debugger', 'no-dupe-keys' etc are handled by oxlint.
    // eslint-plugin-oxlint turns these OFF in ESLint.

    // Flatten the configs to see final rule state for a file
    // Or just inspect the config objects.

    const allRules = {};
    for (const config of specs) {
      if (config.rules) {
        Object.assign(allRules, config.rules);
      }
    }

    // 'no-func-assign' is usually turned off by eslint-plugin-oxlint
    expect(allRules['no-func-assign']).toBe('off');
    // 'no-import-assign'
    expect(allRules['no-import-assign']).toBe('off');

    // 'unused-imports/no-unused-vars' should be off
    expect(allRules['unused-imports/no-unused-vars']).toBe('off');
    // 'no-unused-vars' should be off
    expect(allRules['no-unused-vars']).toBe('off');

    // Check if oxlint specific rule is enabled
    expect(allRules['oxlint/oxlint']).toBeDefined();
  });

  it('should respect custom oxlint config', () => {
    const originalArgv = process.argv;
    process.argv = [...process.argv, '--node-ipc']; // Simulate local mode

    const specs = estjs({ oxlint: { rules: { 'no-console': 'error' } } }, { oxlint: true });

    process.argv = originalArgv;

    // If we override, does it still include recommended 'off' rules?
    // pluginOxlint.buildFromOxlintConfig(overrides) returns rules to turn off based on what oxlint is executing.
    // If 'no-console' is error in oxlint, then 'no-console' might be turned off in eslint?
    // That depends on how buildFromOxlintConfig behaves.

    const allRules = {};
    for (const config of specs) {
      if (config.rules) {
        Object.assign(allRules, config.rules);
      }
    }

    // We generally expect `oxlint/oxlint` to be passed the config
    const oxlintRuleValue = allRules['oxlint/oxlint'];
    expect(oxlintRuleValue[1]).toEqual(
      expect.objectContaining({ rules: { 'no-console': 'error' } }),
    );
  });
});
