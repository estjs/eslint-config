/*
 * @Author: jiangxd<jiangxd2016@gmail.com>
 * @Date: 2023-04-07 21:19:54
 * @LastEditTime: 2023-04-07 22:52:29
 * @LastEditors: jiangxd<jiangxd2016@gmail.com>
 * @Description:
 * @FilePath: /eslint-config/packages/eslint-plugin/src/utils/parser-short.js
 */
import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';
import { runAsWorker } from 'synckit';

const dirVal = ['x', 'y', 'a'];

const dirMap = {
  x: ['l', 'r'],
  y: ['t', 'b'],
  a: ['x', 'y']
};

// TODO: support short token
// const shortToken = [
//   'dark',
//   'flex',
//   'grid',
//   'text',
//   'bg',
//   'border',
//   'ring',
// ];

function isdDirection(dir1, dir2) {

  for (const dir of dirVal) {
    if (dirMap[dir].includes(dir1) && dirMap[dir].includes(dir2)) {
      return dir;
    }
  }
  return null;

}

async function getGenerator() {
  const { config } = await loadConfig();
  return createGenerator(config);
}

let promise;
async function parserToken(token) {
  promise = promise || getGenerator();
  const uno = await promise;
  const parser = await uno.parseToken(token);
  return Promise.resolve(parser);
}
runAsWorker(async (classList) => {
  const reg = /^((m|p)-?)?([blrtxy])(?:-?(-?.+))?$/;
  const borderReg = /^((border|b)-?)?([blrtxy])(?:-(.+))?$/;
  const getReg = async (className) => {
    const isBorder = className.startsWith('b');
    const regv = isBorder ? borderReg : reg;
    const parser = await parserToken(className);
    return {
      test: regv.test(className) && parser,
      match: className.match(regv),
    };
  };
  const used = [];
  const genrate = [];
  for (let i = 0; i < classList.length; i++) {
    const className1 = classList[i];
    const { test, match } = await getReg(className1);
    if (test && !used.includes(className1)) {
      const [, prefix1, , dir1, val1] = match;
      for (let j = i + 1; j < classList.length; j++) {
        const className2 = classList[j];
        const { test: test2, match: match2 } = await getReg(className2);
        if (test2 && className1 !== className2) {
          const [, prefix2, , dir2, val2] = match2;
          if (prefix1 === prefix2 && val1 === val2) {
            const isDir = isdDirection(dir1, dir2);
            if (isDir) {
              used.push(className2, className1);
              const fixedClassName = `${prefix1}${isDir}-${val1}`;
              genrate.push(fixedClassName);
            }
          }
        }
      }
    }
  }
  const clsList = classList.filter(i => !used.includes(i));

  return {
    clsList,
    used,
    genrate,
  };
});
