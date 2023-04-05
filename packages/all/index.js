const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isUnoCssExists = isPackageExists('unocss');

const eslintExtends = [];
if (isVueExists) {
  const Vue = require('vue');
  eslintExtends.push(Vue.version.startsWith('2.') ? '@estjs/eslint-config-vue2' : '@estjs/eslint-config-vue');
} else if (isReactExists) {
  eslintExtends.push('@estjs/eslint-config-react');
} else if (isTSExists) {
  eslintExtends.push('@estjs/eslint-config-ts');
} else {
  eslintExtends.push('@estjs/eslint-config-basic');
}

if (isUnoCssExists) {
  eslintExtends.push('@unocss/eslint-config');
}

module.exports = {
  extends: eslintExtends,
};
