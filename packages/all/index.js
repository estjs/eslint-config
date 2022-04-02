var Vue = require('vue');
const vueEslint = Vue.version.startsWith('2.') ? '@estjs/eslint-config-vue2' : '@estjs/eslint-config-vue';
module.exports = {
  extends: [vueEslint, '@estjs/eslint-config-prettier'],
};
