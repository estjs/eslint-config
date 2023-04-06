import { parseClassname } from '../util/groupMethods';
import getOption from '../util/settings';
import defineTemplateBodyVisitor from '../util/parser';
import {
  calleeToString,
  extractClassnamesFromValue,
  extractValueFromNode,
  isArrayExpression,
  isClassAttribute,
  isLiteralAttributeValue, isObjectExpression,
  isValidVueAttribute, isVLiteralValue
} from '../util/ast.js';
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

// Predefine message for use in context.report conditional.
// messageId will still be usable in tests.
const ARBITRARY_VALUE_DETECTED_MSG = 'Arbitrary value detected in \'{{classname}}\'';

export default{
  meta: {
    docs: {
      description: 'Forbid using arbitrary values in classnames',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      arbitraryValueDetected: ARBITRARY_VALUE_DETECTED_MSG,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          callees: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
          ignoredKeys: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
          config: {
            type: ['string', 'object'],
          },
          tags: {
            type: 'array',
            items: { type: 'string', minLength: 0 },
            uniqueItems: true,
          },
        },
      },
    ],
  },

  create (context) {
    const callees = getOption(context, 'callees');
    const skipClassAttribute = getOption(context, 'skipClassAttribute');
    const tags = getOption(context, 'tags');
    const classRegex = getOption(context, 'classRegex');

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * Recursive function crawling into child nodes
     * @param {ASTNode} node The root node of the current parsing
     * @param {ASTNode} arg The child node of node
     * @returns {void}
     */
    const parseForArbitraryValues = (node, arg = null) => {
      let originalClassNamesValue = null;
      if (arg === null) {
        originalClassNamesValue = extractValueFromNode(node);
      } else {
        switch (arg.type) {
          case 'Identifier':
            return;
          case 'TemplateLiteral':
            arg.expressions.forEach((exp) => {
              parseForArbitraryValues(node, exp);
            });
            arg.quasis.forEach((quasis) => {
              parseForArbitraryValues(node, quasis);
            });
            return;
          case 'ConditionalExpression':
            parseForArbitraryValues(node, arg.consequent);
            parseForArbitraryValues(node, arg.alternate);
            return;
          case 'LogicalExpression':
            parseForArbitraryValues(node, arg.right);
            return;
          case 'ArrayExpression':
            arg.elements.forEach((el) => {
              parseForArbitraryValues(node, el);
            });
            return;
          case 'ObjectExpression':
            // eslint-disable-next-line no-case-declarations
            const isUsedByClassNamesPlugin = node.callee && node.callee.name === 'classnames';
            // eslint-disable-next-line no-case-declarations
            const isVue = node.key && node.key.type === 'VDirectiveKey';
            arg.properties.forEach((prop) => {
              const propVal = isUsedByClassNamesPlugin || isVue ? prop.key : prop.value;
              parseForArbitraryValues(node, propVal);
            });
            return;
          case 'Property':
            parseForArbitraryValues(node, arg.key);
            return;
          case 'Literal':
            originalClassNamesValue = arg.value;
            break;
          case 'TemplateElement':
            originalClassNamesValue = arg.value.raw;
            if (originalClassNamesValue === '') {
              return;
            }
            break;
        }
      }

      const { classNames } = extractClassnamesFromValue(originalClassNamesValue);
      const forbidden = [];
      classNames.forEach((cls, idx) => {
        const parsed = parseClassname(cls, [], {}, idx);
        if (/\[.*]/i.test(parsed.name)) {
          forbidden.push(parsed.name);
        }
      });

      forbidden.forEach((forbiddenClass) => {
        context.report({
          node,
          messageId: 'arbitraryValueDetected',
          data: {
            class: forbiddenClass,
          },
        });
      });
    };

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    const attributeVisitor = function (node) {
      if (!isClassAttribute(node, classRegex) || skipClassAttribute) {
        return;
      }
      if (isLiteralAttributeValue(node)) {
        parseForArbitraryValues(node);
      } else if (node.value && node.value.type === 'JSXExpressionContainer') {
        parseForArbitraryValues(node, node.value.expression);
      }
    };

    const callExpressionVisitor = function (node) {
      const calleeStr = calleeToString(node.callee);
      if (!callees.includes(calleeStr)) {
        return;
      }
      node.arguments.forEach((arg) => {
        parseForArbitraryValues(node, arg);
      });
    };

    const scriptVisitor = {
      JSXAttribute: attributeVisitor,
      TextAttribute: attributeVisitor,
      CallExpression: callExpressionVisitor,
      TaggedTemplateExpression (node) {
        if (!tags.includes(node.tag.name)) {
          return;
        }
        parseForArbitraryValues(node, node.quasi);
      },
    };

    const templateVisitor = {
      CallExpression: callExpressionVisitor,
      /*
      Tagged templates inside data bindings
      https://github.com/vuejs/vue/issues/9721
      */
      VAttribute (node) {
        switch (true) {
          case !isValidVueAttribute(node, classRegex):
            return;
          case isVLiteralValue(node):
            parseForArbitraryValues(node, null);
            break;
          case isArrayExpression(node):
            node.value.expression.elements.forEach((arg) => {
              parseForArbitraryValues(node, arg);
            });
            break;
          case isObjectExpression(node):
            node.value.expression.properties.forEach((prop) => {
              parseForArbitraryValues(node, prop);
            });
            break;
        }
      },
    };

    return defineTemplateBodyVisitor(context, templateVisitor, scriptVisitor);
  },
}
