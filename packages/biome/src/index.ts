import BiomeConfig from '../../../../biome.json';
import { Biome } from './biome';

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
	async create(context) {
		if (!biome) {
			biome = await Biome.create();
			biome.applyConfiguration(BiomeConfig);
		}
		function checkLiteral(node) {
			if (typeof node.value !== 'string') {
				return;
			}
			const input = node.value;

			const formatted = biome.formatContent(input);
			if (formatted !== input) {
				context.report({
					node,
					messageId: 'invalid-biome',
					fix(fixer) {
						return fixer.replaceText(node, `${formatted}`);
					},
				});
			}
		}

		const scriptVisitor = {
			JSXAttribute(node) {
				checkLiteral(node.value);
			},
		};

		const templateBodyVisitor = {
			VAttribute(node) {
				if (node.key.name === 'class' && node.value && node.value.type === 'VLiteral') {
					checkLiteral(node.value);
				}
			},
		};

		if (
			context.parserServices == null ||
			context.parserServices.defineTemplateBodyVisitor == null
		) {
			return scriptVisitor;
		} else {
			// For Vue
			return context.parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
		}
	},
};
