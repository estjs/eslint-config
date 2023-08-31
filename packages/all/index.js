const { isPackageExists } = require('local-pkg');

const isVueExists = isPackageExists('vue');
const isReactExists = isPackageExists('react');
const isTSExists = isPackageExists('typescript');
const isUnoCssExists = isPackageExists('unocss');
const isTaliWindExists = isPackageExists('tailwindcss');
const isAtomicExists = isUnoCssExists || isTaliWindExists || isPackageExists('windicss');

const eslintExtends = [];
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

if (isAtomicExists) {
	eslintExtends.push('plugin:@estjs/recommended');
}

const atomicRules = {
	'@estjs/unocss-order': isUnoCssExists ? 'warn' : 'off',
	// TODO: need support tailwind css .
	'@estjs/atomic-order': isUnoCssExists ? 'off' : 'warn',
};

module.exports = {
	extends: eslintExtends,
	rules: isAtomicExists ? atomicRules : {},
};
