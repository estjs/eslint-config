import { join } from 'node:path';
import { createSyncFn } from 'synckit';
import { distDir } from '../utils/dirs';
import { CLASS_FIELDS } from '../utils/constants.js';

const sortClasses = createSyncFn(join(distDir, 'worker-sort.cjs'));

export default {
  name: 'order',
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Order of Atomic CSS utilities in class attribute',
      recommended: 'warn',
    },
    messages: {
      'invalid-order': 'Atomic CSS utilities are not ordered',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function checkLiteral(node) {
      if (typeof node.value !== 'string') {
        return;
      }
      const input = node.value;
      const sorted = sortClasses(input);
      if (sorted !== input) {
        context.report({
          node,
          messageId: 'invalid-order',
          fix(fixer) {
            return fixer.replaceText(node, `'${sorted.trim()}'`);
          },
        });
      }
    }

    const scriptVisitor = {
      JSXAttribute(node) {
        if (typeof node.name.name === 'string' && CLASS_FIELDS.includes(node.name.name.toLowerCase()) && node.value && node.value.type === 'Literal') {
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

    if (context.parserServices == null || context.parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      // For Vue
      return context.parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  },
};
