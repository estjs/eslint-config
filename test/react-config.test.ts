import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import { describe, expect, it } from 'vitest';
import { react } from '../src/configs/react';
import { defineConfig } from '../src/index';
import type { FlatConfig } from '../src/index';

type LintMessage = Linter.LintMessage;

const reactRecommended = eslintReact.configs.recommended;

function getReactConfigs(rules: Record<string, unknown> = {}): FlatConfig[] {
  return defineConfig({
    markdown: false,
    node: false,
    pnpm: false,
    prettier: false,
    react: true,
    test: false,
    typescript: false,
    unocss: false,
    vue: false,
    rules: { react: rules as never },
  });
}

async function lintReact(
  code: string,
  rules: Record<string, unknown> = {},
  filePath = 'fixture.jsx',
): Promise<LintMessage[]> {
  const eslint = new ESLint({
    overrideConfig: getReactConfigs(rules) as never,
    overrideConfigFile: true,
  });

  const [result] = await eslint.lintText(code, { filePath });
  return result.messages;
}

describe('react config', () => {
  it('reuses the official plugin namespaces, settings, and recommended rules', () => {
    const [baseConfig, reactRulesConfig] = react();

    const basePlugins = (baseConfig.plugins ?? {}) as Record<string, unknown>;
    const baseSettings = (baseConfig.settings ?? {}) as Record<string, unknown>;
    const recommendedPlugins = (reactRecommended.plugins ?? {}) as Record<string, unknown>;
    const recommendedSettings = (reactRecommended.settings ?? {}) as Record<string, unknown>;

    expect(Object.keys(basePlugins)).toEqual(Object.keys(recommendedPlugins));
    expect(Object.keys(baseSettings)).toEqual(Object.keys(recommendedSettings));
    expect(reactRulesConfig.rules).toEqual(reactRecommended.rules);
  });

  it('reports representative @eslint-react rules through ESLint', async () => {
    const messages = await lintReact(`
      import { createContext, useEffect } from 'react';

      const foo = createContext(null);

      export function BrokenComponent(props) {
        if (props.enabled) {
          useEffect(() => {
            console.log(props.value);
          }, []);
        }

        useEffect(() => {
          setTimeout(() => {
            console.log(props.value);
          }, 100);
        }, []);

        return (
          <div>
            <span {...props} key="item" />
            <div dangerouslySetInnerHTML={{ __html: props.html }} />
          </div>
        );
      }
    `);

    const ruleIds = messages.map((message) => message.ruleId);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        '@eslint-react/jsx-no-key-after-spread',
        '@eslint-react/dom-no-dangerously-set-innerhtml',
        '@eslint-react/web-api-no-leaked-timeout',
        '@eslint-react/naming-convention-context-name',
      ]),
    );
  });

  it('allows react rule overrides to replace defaults', async () => {
    const messages = await lintReact(
      `
        export function BrokenComponent(props) {
          return <span {...props} key="item" />;
        }
      `,
      { '@eslint-react/jsx-no-key-after-spread': 'error' },
    );

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: '@eslint-react/jsx-no-key-after-spread',
          severity: 2,
        }),
      ]),
    );
  });
});
