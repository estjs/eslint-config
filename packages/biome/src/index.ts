import BiomeConfig from './biome.json';
import { Biome } from './biome';
import { generateDifferences, showInvisibles } from './helpers';

function reportDifference(context, difference) {
  const { operation, offset, deleteText = '', insertText = '' } = difference;
  const range = /** @type {Range} */ ([offset, offset + deleteText.length]);
  // `context.getSourceCode()` was deprecated in ESLint v8.40.0 and replaced
  // with the `sourceCode` property.
  // TODO: Only use property when our eslint peerDependency is >=8.40.0.
  const [start, end] = range.map(index =>
    (context.sourceCode ?? context.getSourceCode()).getLocFromIndex(index),
  );

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
export default {
	name: 'biome',
	meta: {
		type: 'layout',
		fixable: 'code',
		docs: {
			description: '',
			recommended: 'warn',
		},
		messages: {
			'invalid-biome': 'this content is not formatted with Biome',
		},
		schema: [],
	},
	defaultOptions: [],
	 create(context) {

		const fileInfoOptions =
		(context.options[1] && context.options[1].fileInfoOptions) || {};

	const sourceCode = context.sourceCode ?? context.getSourceCode();

	const filepath = context.filename ?? context.getFilename();

	const onDiskFilepath =
		context.physicalFilename ?? context.getPhysicalFilename();
	const source = sourceCode.text;

		return {
			async Program() {
				if (!biome) {
					biome = await Biome.create();
					biome.applyConfiguration(BiomeConfig);
				}
				const formatted = biome.formatContent(source);

				if (formatted == null) {
					return;
				}
				if (source !== formatted) {
					const differences = generateDifferences(source, formatted);

					for (const difference of differences) {
						reportDifference(context, difference);
					}
				}
			},
		};
	},
};
