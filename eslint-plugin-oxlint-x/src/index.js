import pkg from '../package.json' with { type: 'json' };
import { generateDifferences, showInvisibles } from './helpers.js';
import { format, runAllOxlintFormat } from './oxlint.js';
const { INSERT, DELETE, REPLACE } = generateDifferences;

/**
 * Reports a difference.
 *
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context.
 * @param {import('prettier-linter-helpers').Difference} difference - The difference object.
 * @returns {void}
 */
function reportDifference(context, difference) {
  const { operation, offset, deleteText = '', insertText = '' } = difference;
  const range = [offset, offset + deleteText.length];
  const [start, end] = range.map(index => context.sourceCode.getLocFromIndex(index));

  context.report({
    messageId: operation,
    data: {
      deleteText: showInvisibles(deleteText),
      insertText: showInvisibles(insertText),
    },
    loc: { start, end },
    fix: fixer => fixer.replaceTextRange(range, insertText),
  });
}

const eslintPluginOxlint = {
  meta: { name: pkg.name, version: pkg.version },
  configs: {
    recommended: {
      plugins: ['oxlint'],
      rules: {
        'oxlint/oxlint': 'warn',
      },
    },
  },
  rules: {
    oxlint: {
      meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
          description: 'Format files with oxlint.',
          recommended: 'warn',
        },
        messages: {
          [INSERT]: 'Insert `{{ insertText }}`',
          [DELETE]: 'Delete `{{ deleteText }}`',
          [REPLACE]: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
        },
        schema: [
          {
            type: 'object',
            properties: {},
            additionalProperties: true,
          },
        ],
      },
      create(context) {
        const options = context.options?.[0] || {};
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const filePath = context.filename ?? context.getFilename();
        const source = sourceCode.text;

        return {
          async Program() {
            try {
              const formatted = await format(source, options);
              console.log(`Formatting file: ${filePath}`, source, formatted);

              if (source !== formatted) {
                const differences = generateDifferences(source, formatted);
                for (const difference of differences) {
                  reportDifference(context, difference);
                }
              }
            } catch (error) {
              context.report({
                message: `oxlint error: ${error.message}`,
                loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
              });
            }
          },
        };
      },
    },
  },
};

export { eslintPluginOxlint as default, runAllOxlintFormat };
