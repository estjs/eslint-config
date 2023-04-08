import { runAsWorker } from 'synckit';

// support short token
const shortTokens = [
  'dark',
  'flex',
  'grid',
  'text',
  'bg',
  'border',
  'ring',
];

runAsWorker(async (classList) => {

  const used = [];
  const unused = [];
  const genrate = [];

  for (const className1 of classList) {

    if (used.includes(className1)) {
      continue;
    }
    // support short token
    let token = '';
    const isShortToken = shortTokens.some((i) => {
      if (className1.startsWith(i)) {
        token = i;
        return true;
      }
      return false;
    });
    if (isShortToken) {
      used.push(className1);
      // find equal class
      const equalClass = classList.find(i => i.startsWith(token));
      used.push(...equalClass);

      const gen = `${token}-(${equalClass.map(i=>i.replace(token, '')).join(' ')})`;

      genrate.push(gen);

    } else {
      unused.push(className1);
    }

  }

  return {
    unused,
    used,
    genrate,
  };
});
