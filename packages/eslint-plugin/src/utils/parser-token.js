import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';
import { runAsWorker } from 'synckit';

const dirMap = {
  x: ['l', 'r'],
  y: ['t', 'b'],
  a: ['x', 'y']
};

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
  const borderReg = /^(?:border|b)-([belr-t])(?:-(.+))?$/;
  const getReg = async (className) => {
    const regv = className.startsWith('b') ? borderReg : reg;
    const parser = await parserToken(className);
    return {
      test: regv.test(className) && parser,
      match: className.match(regv)
    };
  };
  const used = [];
  const genrate = [];
  for (let i = 0; i < classList.length; i++) {
    const className1 = classList[i];
    const { test, match } = await getReg(className1);
    if (test && !used.includes(className1)) {
      const [, , prefix1, dir1, val1] = match;
      for (let j = i + 1; j < classList.length; j++) {
        const className2 = classList[j];
        const { test: test2, match: match2 } = await getReg(className2);
        if (test2 && className1 !== className2) {
          const [, , prefix2, dir2, val2] = match2;
          if (prefix1 === prefix2 && val1 === val2) {
            const x = dirMap.x.includes(dir1) ? dirMap.x.includes(dir2) ? 'x' : undefined : undefined;
            const y = dirMap.y.includes(dir1) ? dirMap.y.includes(dir2) ? 'y' : undefined : undefined;
            const a = dirMap.a.includes(dir1) ? dirMap.a.includes(dir2) ? 'a' : undefined : undefined;
            if (x || y || a) {
              used.push(className2, className1);
              const fixedClassName = `${prefix1}${x || y || a}-${val1}`;
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
