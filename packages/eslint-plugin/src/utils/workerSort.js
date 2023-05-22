import { loadConfig } from '@unocss/config';
import { createGenerator } from '@unocss/core';
import { runAsWorker } from 'synckit';
import { sortRules } from './sortRules';

async function getGenerator() {
  const { config } = await loadConfig();
  return createGenerator(config);
}

let promise;

runAsWorker(async (classes) => {
  promise = promise || getGenerator();
  const uno = await promise;
  return await sortRules(classes, uno);
});
