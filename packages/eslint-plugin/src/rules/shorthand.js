import { join } from 'node:path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { createSyncFn } from 'synckit';
import { distDir } from '../utils/dirs';
import { CLASS_FIELDS } from '../utils/constants.js';

const parserToken = createSyncFn(join(distDir, 'parser-token.cjs'));

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
      const reg = /^((m|p)-?)?([blrtxy])(?:-?(-?.+))?$/;
      const borderReg = /^(?:border|b)-([belr-t])(?:-(.+))?$/;
      const getReg = (className) => {
        const regv = className.startsWith('b') ? borderReg : reg;
        const parser = parserToken(className);
        return {
          test: regv.test(className) && parser,
          match: className.match(regv)
        };
      };
      const classList = Array.from(new Set(node.value.value.split(' ') || []));
      if (classList.length < 2) {
        return;
      }
      const used = [];
      const genrate = [];
      for (let i = 0; i < classList.length; i++) {
        const className1 = classList[i];
        const { test, match } = getReg(className1);
        if (test && !used.includes(className1)) {
          const [, , prefix1, dir1, val1] = match;
          for (let j = i + 1; j < classList.length; j++) {
            const className2 = classList[j];
            const { test: test2, match: match2 } = getReg(className2);
            if (test2 && className1 !== className2) {
              const [, , prefix2, dir2, val2] = match2;
              if (prefix1 === prefix2 && val1 === val2) {
                const x = dirMap.x.includes(dir1) ? dirMap.x.includes(dir2) ? 'x' : undefined : undefined;
                const y = dirMap.y.includes(dir1) ? dirMap.y.includes(dir2) ? 'y' : undefined : undefined;
                const a = dirMap.a.includes(dir1) ? dirMap.a.includes(dir2) ? 'a' : undefined : undefined;
                if (!x && !y && !a) {
                  break;
                }
                used.push(className2, className1);
                const fixedClassName = `${prefix1}${x || y || a}-${val1}`;

                genrate.push(fixedClassName);

                const findIndex = classList.indexOf(className1);
                classList.splice(findIndex, 1);
                const findIndex2 = classList.indexOf(className2);
                classList.splice(findIndex2, 1);

                console.log(classList, genrate);

              }
            }
          }
        }
      }

      if (genrate.length > 0) {
        context.report({
          node,
          message: 'Utility classes like {{className}} should be replaced ',
          data: { className: used[0] },
          fix(fixer) {
            return fixer.replaceText(
              node,
              [...genrate, ...classList].join(' ')
            );
          }
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
