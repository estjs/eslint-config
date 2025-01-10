import { name, version } from '../package.json';
import BiomeConfig from '../biome.json';
import { generateDifferences, showInvisibles } from './helpers';
import Biome from './biome';
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
let biome;
const eslintPluginBiome = {
  meta: { name, version },
  configs: {
    recommended: {
      plugins: ['biome'],
      rules: {
        'biome/biome': 'warn',
      },
    },
  },
  rules: {
    biome: {
      meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
          description: '',
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
        const useCustomConfig = context.options?.[0] || {};
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const filePath = context.filename ?? context.getFilename();
        const onDiskFilepath = context.physicalFilename ?? context.getPhysicalFilename();
        const source = sourceCode.text;

        return {
          async Program() {
            if (!biome) {
              biome = await Biome.create();
              biome.applyConfiguration({ ...BiomeConfig, ...useCustomConfig });
            }
            let content;
            try {
              const fromated = biome.formatContent(source, {
                filePath,
                onDiskFilepath,
              });
              content = fromated.content;
            } catch (error_) {
              if (!(error_ instanceof SyntaxError)) {
                throw error_;
              }
              const message = `Parsing error: ${error_.message}`;
              const error = /** @type {SyntaxError & {codeFrame: string; loc: SourceLocation}} */ (
                error_
              );
              context.report({ message, loc: error });
              return;
            }
            if (content == null) {
              return;
            }
            if (source !== content) {
              const differences = generateDifferences(source, content);
              for (const difference of differences) {
                reportDifference(context, difference);
              }
            }
          },
        };
      },
    },
  },
};
export default eslintPluginBiome;
