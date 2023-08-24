import { join } from 'node:path';
import { createSyncFn } from 'synckit';
import MagicString from 'magic-string';
import { distDir } from '../utils/utils';

const sortClasses = createSyncFn(join(distDir, 'workerSort.cjs'));

const INGORE_ATTRIBUTES = ['style', 'class', 'classname', 'value'];

export default {
	name: 'order-attributify',
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
				const sorted = sortClasses(input);
				if (sorted !== input) {
					context.report({
						node,
						messageId: 'invalid-order',
						fix(fixer) {
							const codeFull = context.getSourceCode();
							const offset = node.range[0];
							const code = codeFull.getText().slice(node.range[0], node.range[1]);

							const s = new MagicString(code);

							const sortedNodes = valueless
								.map(i => [i.range[0] - offset, i.range[1] - offset])
								.sort((a, b) => b[0] - a[0]);

							for (const [start, end] of sortedNodes.slice(1)) {
								s.remove(start, end);
							}

							s.overwrite(sortedNodes[0][0], sortedNodes[0][1], ` ${sorted.trim()} `);

							return fixer.replaceText(node, s.toString());
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
