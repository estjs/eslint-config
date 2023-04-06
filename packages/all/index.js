const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isAtomicExists = isPackageExists('unocss') || isPackageExists('tailwindcss') || isPackageExists('windicss');

console.log(isAtomicExists);

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

if (isAtomicExists) {
  eslintExtends.push('@estjs/eslint-config-atomic');
}

module.exports = {
  extends: eslintExtends,
};
