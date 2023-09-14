import { join } from 'node:path';
import { createSyncFn } from 'synckit';
import { CLASS_FIELDS, distDir } from '../utils/utils';

const parserShort = createSyncFn(join(distDir, 'parserShorthand.cjs'));

export default {
	name: 'atomic-shorthand',
	meta: {
		docs: {
			description: 'Enforces the usage of shorthand Atomic CSS classnames',
			category: 'Best Practices',
			recommended: true,
		},
		fixable: 'code',
		messages: {
			'invalid-shorthand': 'Atomic CSS utilities are not shorthand',
		},
		schema: [],
	},
	defaultOptions: [],

	create(context) {
		const checkLiteral = node => {
			if (typeof node.value !== 'string') {
				return;
			}
			const splitList = node.value.includes(')')
				? node.value.split(/^(\S+?)\s+(\S+?)\s+(\S+?)\s+(.+)$/)
				: node.value.split(' ');
			const classList = Array.from(new Set(splitList || []));
			if (classList.length < 2) {
				return;
			}
			const { unused, used, generated } = parserShort(classList);

			if (generated && generated.length > 0) {
				context.report({
					node,
					message: 'Utility classes like {{className}} should be replaced ',
					data: { className: used.join(', ') },
					fix(fixer) {
						return fixer.replaceTextRange(
							[node.range[0] + 1, node.range[1] - 1],
							[...generated, ...unused].join(' '),
						);
					},
				});
			}
		};
		const scriptVisitor = {
			JSXAttribute(node) {
				if (
					typeof node.name.name === 'string' &&
					CLASS_FIELDS.includes(node.name.name.toLowerCase()) &&
					node.value &&
					node.value.type === 'Literal'
				) {
					checkLiteral(node.value);
				}
			},
		};

		const templateBodyVisitor = {
			VAttribute(node) {
				if (node.key.name === 'class' && node.value.type === 'VLiteral') {
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