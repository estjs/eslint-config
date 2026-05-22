import { describe, expect, it } from 'vitest';
import { defineConfig } from '../src/index';
import type { FlatConfig } from '../src/index';

function hasNamed(configs: FlatConfig[], prefix: string): boolean {
  return configs.some((c) => typeof c.name === 'string' && c.name.startsWith(prefix));
}

function findNamed(configs: FlatConfig[], name: string): FlatConfig | undefined {
  return configs.find((c) => c.name === name);
}

describe('defineConfig', () => {
  describe('prettier', () => {
    it('enables prettier by default', () => {
      const configs = defineConfig();
      expect(hasNamed(configs, 'estjs/prettier/')).toBe(true);
    });

    it('drops the prettier block when prettier:false', () => {
      const configs = defineConfig({ prettier: false });
      expect(hasNamed(configs, 'estjs/prettier/')).toBe(false);
    });

    it('merges prettier options into defaults', () => {
      const configs = defineConfig({ prettier: { semi: false, printWidth: 120 } });
      const prettierBlock = findNamed(configs, 'estjs/prettier/rules');
      expect(prettierBlock).toBeDefined();

      const entry = prettierBlock?.rules?.['prettier/prettier'] as [string, Record<string, unknown>];
      expect(entry?.[0]).toBe('warn');
      expect(entry?.[1].semi).toBe(false);
      expect(entry?.[1].printWidth).toBe(120);
      // Default value still present where not overridden.
      expect(entry?.[1].tabWidth).toBe(2);
    });
  });

  describe('feature toggles', () => {
    it('enables node / markdown / regexp by default', () => {
      const configs = defineConfig();
      expect(hasNamed(configs, 'estjs/node/')).toBe(true);
      expect(hasNamed(configs, 'estjs/markdown/')).toBe(true);
      expect(hasNamed(configs, 'estjs/regexp/')).toBe(true);
    });

    it('keeps pnpm disabled by default', () => {
      const configs = defineConfig();
      expect(hasNamed(configs, 'estjs/pnpm/')).toBe(false);
    });

    it('respects explicit toggles', () => {
      const configs = defineConfig({
        node: false,
        markdown: false,
        regexp: false,
        pnpm: true,
      });
      expect(hasNamed(configs, 'estjs/node/')).toBe(false);
      expect(hasNamed(configs, 'estjs/markdown/')).toBe(false);
      expect(hasNamed(configs, 'estjs/regexp/')).toBe(false);
      expect(hasNamed(configs, 'estjs/pnpm/')).toBe(true);
    });
  });

  describe('ignores and globals', () => {
    it('appends user ignore patterns', () => {
      const configs = defineConfig({ ignores: ['**/custom-build/**'] });
      const ignoresBlock = findNamed(configs, 'estjs/ignores');
      expect(ignoresBlock?.ignores).toContain('**/custom-build/**');
      // Defaults preserved.
      expect(ignoresBlock?.ignores).toContain('**/node_modules');
    });

    it('passes user globals into the JavaScript setup block', () => {
      const configs = defineConfig({ globals: { __DEV__: 'readonly' } });
      const jsSetup = findNamed(configs, 'estjs/javascript/setup');
      const globals = (jsSetup?.languageOptions?.globals ?? {}) as Record<string, unknown>;
      expect(globals.__DEV__).toBe('readonly');
    });
  });
});
