import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';
import { runAsWorker } from 'synckit';

async function getGenerator() {
  const { config } = await loadConfig();
  return createGenerator(config);
}

let promise;
runAsWorker(async (token)=> {
  promise = promise || getGenerator();
  const uno = await promise;
  const parser = await uno.parseToken(token);
  return Promise.resolve(parser);
}
);
