import { configCommand } from '../plugins';

export const command = function (overrides = {}) {
  return [configCommand(overrides)];
};
