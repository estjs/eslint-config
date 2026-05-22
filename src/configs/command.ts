import { commandConfig } from '../plugins';
import { normalizeRules } from '../shared';
import type { CommandRulesOverride, FlatConfig } from '../types';

export interface CommandOptions {
  rules?: CommandRulesOverride;
}

export function command(options: CommandOptions = {}): FlatConfig[] {
  const baseConfig = commandConfig();
  const userRules = normalizeRules(options.rules, 'command');

  return [
    {
      ...baseConfig,
      name: 'estjs/command/rules',
      rules: {
        ...baseConfig.rules,
        ...userRules,
      },
    },
  ];
}
