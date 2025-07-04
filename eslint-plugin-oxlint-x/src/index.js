import pkg from '../package.json' with { type: 'json' };
import { getClient } from './lsp.js';
import { runAllOxlintFormat } from './oxlint.js';

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
        messages: {},
        schema: [
          {
            type: 'object',
            properties: {},
            additionalProperties: true,
          },
        ],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const filePath = context.filename ?? context.getFilename();
        const source = sourceCode.text;

        return {
          async Program() {
            try {
              const client = getClient();
              const uri = `file://${filePath}`;
              const diagnostics = await client.lint({ uri, text: source });

              for (const diag of diagnostics) {
                const start = {
                  line: diag.range.start.line + 1,
                  column: diag.range.start.character,
                };
                const end = { line: diag.range.end.line + 1, column: diag.range.end.character };
                const loc = { start, end };

                // Attempt to derive fix from `diag.data?.fix` (oxlint custom) or `diag.relatedInformation` etc.
                let fix;
                if (diag.data && diag.data.fix) {
                  const edit = diag.data.fix;
                  const startIdx = sourceCode.getIndexFromLoc({
                    line: edit.range.start.line + 1,
                    column: edit.range.start.character,
                  });
                  const endIdx = sourceCode.getIndexFromLoc({
                    line: edit.range.end.line + 1,
                    column: edit.range.end.character,
                  });
                  fix = fixer => fixer.replaceTextRange([startIdx, endIdx], edit.newText);
                }

                context.report(
                  fix
                    ? {
                        message: diag.message,
                        loc,
                        fix,
                      }
                    : { message: diag.message, loc },
                );
              }
            } catch (error) {
              context.report({
                message: `oxlint LSP error: ${error.message}`,
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
