import { join } from 'node:path';
import { createSyncFn } from 'synckit';
import { distDir } from '../utils/utils';

const sortClasses = createSyncFn(join(distDir, 'workerSort.cjs'));

const INGORE_ATTRIBUTES = ['style', 'class', 'classname', 'value'];

export default {
	name: 'atomic-order-attributify',
	meta: {
		type: 'layout',
		fixable: 'code',
		docs: {
			description: 'Order of Atomic CSS attributes',
			recommended: false,
		},
		messages: {
			'invalid-order': 'Atomic CSS attributes are not ordered',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const scriptVisitor = {};

		const templateBodyVisitor = {
			VStartTag(node) {
				const valueless = node.attributes.filter(
					i =>
						typeof i.key?.name === 'string' &&
						!INGORE_ATTRIBUTES.includes(i.key?.name?.toLowerCase()) &&
						i.value == null,
				);
				if (!valueless.length) {
					return;
				}

				const input = valueless
					.map(i => i.key.name)
					.join(' ')
					.trim();
				const { isSorted, orderedClassNames } = sortClasses(input);
				if (isSorted) {
					context.report({
						node,
						messageId: 'invalid-order',
						fix(fixer) {
							return fixer.replaceText(node, `'${orderedClassNames.join(' ')}'`);
						},
					});
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
