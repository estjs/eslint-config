import { runAsWorker } from 'synckit';
import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';

// 支持简写的 token
const shortTokens = [
  'dark',
  'flex',
  'grid',
  'text',
  'bg',
  'border',
  'ring',
];
async function getGenerator() {
  const { config } = await loadConfig();
  return createGenerator(config);
}

let promise;
async function parserGroup(classes,prefix) {
  promise = promise || getGenerator();
  const uno = await promise;
	const groupClass = uno.collapseVariantGroup(classes, prefix);
  return Promise.resolve(groupClass);
}
runAsWorker(async (classList) => {
  const used = [];
  const unused = [];
  const genrate = [];

  for (const className of classList) {
    if (used.includes(className)) {
      continue;
    }
    // 支持简写的 token
    let token = '';
    const isShortToken = shortTokens.some((i) => {
      if (className.startsWith(i)) {
        token = i;
        return true;
      }
      return false;
    });
    if (isShortToken) {
      // 找到对应的 class
      const equalClasses = classList.filter(i => i.startsWith(token) && i !== className);

      if (equalClasses.length) {
        used.push(className);

        equalClasses.push(className);
        equalClasses.forEach(equalClass => used.push(equalClass));

        // find className 完全等于token的 (暂时只有grid和flex需要这样处理)
        const equalTokenClasses = equalClasses.filter(i => i === token && (token === 'grid' || token === 'flex') );

        const isEqualToken = equalTokenClasses.length > 0;
        // 只有一个，也必须只有一个
        if (isEqualToken) {
          equalClasses.splice(equalClasses.indexOf(equalTokenClasses[0]), 1);
        }

        const gen = `${token}-(${isEqualToken ? '~ ' : ''}${equalClasses.map(i=>i.replace(token, '').replace(/^[:-]/, '')).join(' ')})`;

        genrate.push(gen);
      } else {
        unused.push(className);
      }
    } else {
      unused.push(className);
    }
  }

  return {
    unused,
    used,
    genrate,
  };
});
