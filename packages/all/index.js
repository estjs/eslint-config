const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isUnoCssExists = isPackageExists('unocss');
const isTaliWindExists = isPackageExists('tailwindcss');
const isAtomicExists = isUnoCssExists || isTaliWindExists;

const eslintExtends = [];
const pluginsExtends = []
if (isVueExists) {
	const Vue = require('vue');
	eslintExtends.push(
		Vue.version.startsWith('2.') ? '@estjs/eslint-config-vue2' : '@estjs/eslint-config-vue',
	);
} else if (isReactExists) {
	eslintExtends.push('@estjs/eslint-config-react');
} else if (isTSExists) {
	eslintExtends.push('@estjs/eslint-config-ts');
} else {
	eslintExtends.push('@estjs/eslint-config-basic');
}

// if (isAtomicExists) {
	pluginsExtends.push('atomic');
// }
module.exports = {
	extends: eslintExtends,
	plugins: pluginsExtends
};
