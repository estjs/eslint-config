import { ESLintUtils } from '@typescript-eslint/utils';
import { CLASS_FIELDS } from '../utils/constants.js';

const createShorthandRule = ESLintUtils.RuleCreator(name => name);
const dirMap = {
  x: ['l', 'r'],
  y: ['t', 'b'],
  a: ['x', 'y']
};
export default createShorthandRule({
  name: 'shorthand',
  meta: {
    docs: {
      description: 'Enforces the usage of shorthand Atomic CSS classnames',
      category: 'Best Practices',
      recommended: true
    },
    fixable: 'code',
    messages: {
      'invalid-shorthand': 'Atomic CSS utilities are not shorthand',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const checkLiteral = (node) => {
      if (typeof node.value.value !== 'string') {
        return;
      }

      // Define the regular expression to match shorthand utility classnames
      const reg = /^((m|p|border|b)-?)?([blrtxy])(?:-?(-?.+))?$/;
      const classList = Array.from(new Set(...node.value.value.split(' ')));
      if (classList.length < 2) {
        return;
      }
      const fixableNodes = [];
      const used = [];

      // Iterate over each classname and check if it matches the regular expression
      for (let i = 0; i < classList.length; i++) {
        const className1 = classList[i];
        if (reg.test(className1) && !used.includes(className1)) {
          const [, , prefix1, dir1, val1] = className1.match(reg);

          // Look ahead to find the next class name with a matching prefix
          for (let j = i + 1; j < classList.length; j++) {
            const className2 = classList[j];
            if (reg.test(className2) && className1 !== className2) {

              const [, , prefix2, dir2, val2] = className2.match(reg);

              // If the two class names have the same direction, combine them
              if (prefix1 === prefix2 && val1 === val2) {
                const x = dirMap.x.includes(dir1) ? dirMap.x.includes(dir2) ? 'x' : undefined : undefined;
                const y = dirMap.y.includes(dir1) ? dirMap.y.includes(dir2) ? 'y' : undefined : undefined;
                const a = dirMap.a.includes(dir1) ? dirMap.a.includes(dir2) ? 'a' : undefined : undefined;
                if (!x && !y && !a) {
                  break;
                }
                // 标记已被使用
                used.push(className2);
                const fixedClassName = `${prefix1}${x || y || a}-${val1}`;
                const fixedNode = {
                  ...node,
                  value: {
                    ...node.value,
                    value: node.value.value.replace(className1 + ' ' + className2, fixedClassName)
                  }
                };
                fixableNodes.push(fixedNode);
              }
            }
          }
        }
      }

      if (fixableNodes.length > 0) {
        context.report({
          node,
          message: 'Utility classes like {{className}} should be replaced ',
          data: { className: fixableNodes[0].value.value },
          fix(fixer) {
            return fixer.replaceTextRange(
              [node.value.range[0] + 1, node.value.range[1] - 1],
              fixableNodes.map(node => node.value.value).join(' ')
            );
          },
        });
      }
    };

    const scriptVisitor = {
      JSXAttribute(node) {
        if (typeof node.name.name === 'string'
					&& CLASS_FIELDS.includes(node.name.name.toLowerCase())
					&& node.value && node.value.type === 'Literal') {
          checkLiteral(node);
        }
      },
    };

    const templateBodyVisitor = {
      VAttribute(node) {
        if (node.key.name === 'class' && node.value.type === 'VLiteral') {
          checkLiteral(node);
        }
      },
    };

    if (context.parserServices == null || context.parserServices.defineTemplateBodyVisitor == null) {
      return scriptVisitor;
    } else {
      // For Vue
      return context.parserServices?.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
    }
  }
});
