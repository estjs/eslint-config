const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isUnoCssExists = isPackageExists("unocss")

const eslintList = [];
if (isVueExists) {
  const Vue = require('vue');
  eslintList.push(Vue.version.startsWith('2.') ? '@estjs/eslint-config-vue2' : '@estjs/eslint-config-vue');
}
if (isReactExists) {
  eslintList.push('@estjs/eslint-config-react');
}

if(isUnoCssExists){
	eslintList.push("@unocss/eslint-config")
}


if (isTSExists) {
  eslintList.push('@estjs/eslint-config-ts');
} else {
  eslintList.push('@estjs/eslint-config-basic');
}
module.exports = {
  extends: eslintList,
};
