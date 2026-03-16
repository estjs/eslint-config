import { ESLint } from 'eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import { describe, expect, it } from 'vitest';

import { estjs } from '../src/index.js';
import { react } from '../src/configs/react.js';

const reactRecommended = eslintReact.configs.recommended;

function getReactConfigs(overrides = {}) {
  return estjs(
    {
      react: overrides,
    },
    {
      markdown: false,
      node: false,
      pnpm: false,
      prettier: false,
      react: true,
      test: false,
      typescript: false,
      unocss: false,
      vue: false,
    },
  );
}

async function lintReact(code, overrides = {}, filePath = 'fixture.jsx') {
  const eslint = new ESLint({
    overrideConfig: getReactConfigs(overrides),
    overrideConfigFile: true,
  });

  const [result] = await eslint.lintText(code, { filePath });
  return result.messages;
}

describe('react config', () => {
  it('reuses the official plugin namespaces, settings, and recommended rules', () => {
    const [baseConfig, reactRulesConfig] = react();

    expect(Object.keys(baseConfig.plugins)).toEqual(Object.keys(reactRecommended.plugins));
    expect(Object.keys(baseConfig.settings)).toEqual(Object.keys(reactRecommended.settings));
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

    const ruleIds = messages.map(message => message.ruleId);

    expect(ruleIds).toEqual(
      expect.arrayContaining([
        '@eslint-react/jsx-key-before-spread',
        '@eslint-react/dom/no-dangerously-set-innerhtml',
        '@eslint-react/web-api/no-leaked-timeout',
        '@eslint-react/naming-convention/context-name',
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
      {
        '@eslint-react/jsx-key-before-spread': 'error',
      },
    );

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: '@eslint-react/jsx-key-before-spread',
          severity: 2,
        }),
      ]),
    );
  });
});
