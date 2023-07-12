/*
 * @Author: jiangxd<jiangxd2016@gmail.com>
 * @Date: 2023-06-30 10:51:38
 * @LastEditTime: 2023-06-30 10:52:11
 * @LastEditors: jiangxd<jiangxd2016@gmail.com>
 * @Description:
 * @FilePath: /eslint-config/packages/all/index.js
 */
const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isAtomicExists = isPackageExists('unocss') || isPackageExists('tailwindcss') || isPackageExists('windicss');

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
	eslintExtends.push('@unocss');
}

module.exports = {
	extends: eslintExtends,
};
