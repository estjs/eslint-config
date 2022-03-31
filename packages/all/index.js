var Vue = require('vue');
const vueEslint = Vue.version.startsWith('2.') ? '@ventjs/eslint-config-vue2' : '@ventjs/eslint-config-vue';
module.exports = {
  extends: [vueEslint, '@ventjs/eslint-config-prettier'],
};
