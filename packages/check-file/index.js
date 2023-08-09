module.exports = {
	plugins: ['check-file'],
	rules: {
		'check-file/folder-match-with-fex': [
			'warn',
			{
				'*.{test,spec}.{js,jsx,ts,tsx}': '**/__tests__/',
				'*.styled.{jsx,tsx}': '**/pages/',
			},
		],
		'check-file/filename-naming-convention': [
			'warn',
			{
				'**/*.{jsx,tsx,js,ts,vue}': 'CAMEL_CASE',
			},
			{
				ignoreMiddleExtensions: true,
			},
		],
		'check-file/folder-naming-convention': [
			'warn',
			{
				'**/*': 'KEBAB_CASE',
			},
		],
	},
};
