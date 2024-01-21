module.exports = {
	env: {
		es6: true,
		browser: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:eslint-comments/recommended',
		'plugin:jsonc/recommended-with-jsonc',
		'plugin:yml/standard',
		'plugin:prettier/recommended',
		'plugin:markdown/recommended',
		'plugin:jsdoc/recommended',
	],
	ignorePatterns: [
		'*.min.*',
		'CHANGELOG.md',
		'dist',
		'LICENSE*',
		'output',
		'coverage',
		'temp',
		'packages-lock.json',
		'pnpm-lock.yaml',
		'yarn.lock',
		'__snapshots__',
		'!.github',
		'!.vitepress',
		'!.vscode',
		// force exclude
		'**/.vitepress/cache',
	],
	plugins: [
		'html',
		'unicorn',
		'import',
		'n',
		'promise',
		'no-only-tests',
		'unused-imports',
		'jsdoc',
		'prettier',
	],
	settings: {
		'import/resolver': {
			node: { extensions: ['.js', '.mjs', '.ts', '.d.ts'] },
		},
	},
	overrides: [
		{
			files: ['*.json', '*.json5', '*.jsonc'],
			parser: 'jsonc-eslint-parser',
			rules: {
				'jsonc/array-bracket-spacing': ['warn', 'never'],
				'jsonc/comma-dangle': ['off', 'never'],
				'jsonc/comma-style': ['warn', 'last'],
				'jsonc/indent': 'off',
				'jsonc/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
				'jsonc/no-octal-escape': 'warn',
				'jsonc/object-curly-newline': ['warn', { multiline: true, consistent: true }],
				'jsonc/object-curly-spacing': ['warn', 'always'],
				'jsonc/object-property-newline': ['warn', { allowMultiplePropertiesPerLine: true }],
			},
		},
		{
			files: ['*.yaml', '*.yml'],
			parser: 'yaml-eslint-parser',
			rules: {
				'spaced-comment': 'off',
			},
		},
		{
			files: ['package.json'],
			parser: 'jsonc-eslint-parser',
			rules: {
				'jsonc/sort-keys': [
					'error',
					{
						pathPattern: '^$',
						order: [
							'publisher',
							'name',
							'displayName',
							'type',
							'version',
							'private',
							'packageManager',
							'description',
							'author',
							'license',
							'funding',
							'homepage',
							'repository',
							'bugs',
							'keywords',
							'categories',
							'sideEffects',
							'exports',
							'main',
							'module',
							'unpkg',
							'jsdelivr',
							'types',
							'typesVersions',
							'bin',
							'icon',
							'files',
							'engines',
							'activationEvents',
							'contributes',
							'scripts',
							'peerDependencies',
							'peerDependenciesMeta',
							'dependencies',
							'optionalDependencies',
							'devDependencies',
							'pnpm',
							'overrides',
							'resolutions',
							'husky',
							'simple-git-hooks',
							'lint-staged',
							'eslintConfig',
						],
					},
					{
						pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
						order: { type: 'asc' },
					},
					{
						pathPattern: '^resolutions$',
						order: { type: 'asc' },
					},
					{
						pathPattern: '^pnpm.overrides$',
						order: { type: 'asc' },
					},
					{
						pathPattern: '^exports.*$',
						order: ['types', 'import', 'require', 'default'],
					},
				],
			},
		},
		{
			files: ['*.d.ts'],
			rules: {
				'import/no-duplicates': 'off',
			},
		},
		{
			files: ['*.js', '*.cjs', '*.jsx'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/no-require-imports': 'off',
			},
		},
		{
			files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
			rules: {
				'no-void': ['error', { allowAsStatement: true }],
				'dot-notation': 'off',
			},
		},
		{
			files: ['scripts/**/*.*', 'cli.*'],
			rules: {
				'no-console': 'off',
			},
		},
		{
			files: ['*.test.ts', '*.test.js', '*.spec.ts', '*.spec.js'],
			rules: {
				'no-unused-expressions': 'off',
				'no-only-tests/no-only-tests': 'error',
			},
		},
		{
			// Code blocks in markdown file
			files: ['**/*.md/*.*'],
			rules: {
				'@typescript-eslint/no-redeclare': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/comma-dangle': 'off',
				'@typescript-eslint/consistent-type-imports': 'off',
				'@typescript-eslint/no-namespace': 'off',
				'@typescript-eslint/no-require-imports': 'off',
				'import/no-unresolved': 'off',
				'unused-imports/no-unused-imports': 'off',
				'unused-imports/no-unused-vars': 'off',
				'no-alert': 'off',
				'no-console': 'off',
				'no-restricted-imports': 'off',
				'no-undef': 'off',
				'no-unused-expressions': 'off',
				'no-unused-vars': 'off',
				'n/prefer-global/process': 'off',
			},
		},
	],
	rules: {
		// import
		'import/order': 'warn',
		'import/first': 'error',
		'import/no-mutable-exports': 'error',
		'import/no-unresolved': 'off',
		'import/no-absolute-path': 'off',
		'import/no-self-import': 'error',
		'import/no-named-as-default-member': 'off',
		'import/no-named-as-default': 'off',
		'import/namespace': 'off',
		'import/newline-after-import': ['error', { count: 1, considerComments: true }],
		'sort-imports': [
			'error',
			{
				ignoreCase: false,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				allowSeparatedGroups: false,
			},
		],
		// Common
		'semi': ['warn', 'always'],
		'curly': ['error', 'all'],
		// TODO: fix prettier
		// 'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
		'quotes': 'off',
		'quote-props': ['warn', 'consistent-as-needed'],
		'no-unused-vars': 'warn',
		'no-param-reassign': 'off',
		'array-bracket-spacing': ['error', 'never'],
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],
		'block-spacing': ['error', 'always'],
		'camelcase': 'off',
		'comma-spacing': ['warn', { before: false, after: true }],
		'comma-style': ['error', 'last'],
		'comma-dangle': ['warn', 'always-multiline'],
		'no-constant-condition': 'warn',
		'no-debugger': 'error',
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-cond-assign': ['error'],
		'func-call-spacing': ['off', 'never'],
		'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
		'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
		'object-curly-spacing': ['error', 'always'],
		'no-return-await': 'off',
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'no-restricted-globals': [
			'error',
			{ name: 'global', message: 'Use `globalThis` instead.' },
			{ name: 'self', message: 'Use `globalThis` instead.' },
		],
		'no-restricted-properties': [
			'error',
			{
				property: '__proto__',
				message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
			},
			{ property: '__defineGetter__', message: 'Use `Object.defineProperty` instead.' },
			{ property: '__defineSetter__', message: 'Use `Object.defineProperty` instead.' },
			{ property: '__lookupGetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' },
			{ property: '__lookupSetter__', message: 'Use `Object.getOwnPropertyDescriptor` instead.' },
		],
		'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 1 }],

		// es6
		'no-var': 'error',
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: true,
			},
		],
		'prefer-arrow-callback': [
			'error',
			{
				allowNamedFunctions: false,
				allowUnboundThis: true,
			},
		],
		'object-shorthand': [
			'error',
			'always',
			{
				ignoreConstructors: false,
				avoidQuotes: true,
			},
		],
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'template-curly-spacing': 'error',
		'arrow-parens': 'off',
		'generator-star-spacing': 'off',
		'spaced-comment': [
			'warn',
			'always',
			{
				line: {
					markers: ['/'],
					exceptions: ['/', '#'],
				},
				block: {
					markers: ['!'],
					exceptions: ['*'],
					balanced: true,
				},
			},
		],

		// best-practice
		'array-callback-return': 'error',
		'block-scoped-var': 'error',
		'consistent-return': 'off',
		'complexity': 'off',
		'eqeqeq': ['error', 'smart'],
		'no-alert': 'warn',
		'no-case-declarations': 'error',
		'no-multi-spaces': 'error',
		'no-multi-str': 'error',
		'no-with': 'error',
		'no-void': 'error',
		'no-useless-escape': 'off',
		'no-invalid-this': 'error',
		'vars-on-top': 'error',
		'require-await': 'off',
		'no-return-assign': 'off',
		'max-statements-per-line': ['error', { max: 1 }],

		// unicorns
		// Pass error message when throwing errors
		'unicorn/error-message': 'error',
		// Uppercase regex escapes
		'unicorn/escape-case': 'error',
		// Array.isArray instead of instanceof
		'unicorn/no-instanceof-array': 'error',
		// Prevent deprecated `new Buffer()`
		'unicorn/no-new-buffer': 'error',
		// Keep regex literals safe!
		'unicorn/no-unsafe-regex': 'off',
		// Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
		// fix prettier
		'unicorn/number-literal-case': 'off',
		// includes over indexOf when checking for existence
		'unicorn/prefer-includes': 'error',
		// String methods startsWith/endsWith instead of more complicated stuff
		'unicorn/prefer-string-starts-ends-with': 'error',
		// textContent instead of innerText
		'unicorn/prefer-text-content': 'error',
		// Enforce throwing type error when throwing error while checking typeof
		'unicorn/prefer-type-error': 'error',
		// Use new when throwing error
		'unicorn/throw-new-error': 'error',
		// Prefer using the node: protocol
		'unicorn/prefer-node-protocol': 'error',
		// Prefer using number properties like `Number.isNaN` rather than `isNaN`
		'unicorn/prefer-number-properties': 'error',
		// Ban `new Array` as `Array` constructor's params are ambiguous
		'unicorn/no-new-array': 'error',

		'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
		'eslint-comments/disable-enable-pair': 'off',
		// yml
		'yml/quotes': ['error', { prefer: 'single', avoidEscape: false }],
		'yml/no-empty-document': 'off',

		// node
		'n/prefer-global/buffer': ['error', 'never'],
		'n/handle-callback-err': ['error', '^(err|error)$'],
		'n/no-callback-literal': 'error',
		'n/no-deprecated-api': 'error',
		'n/no-exports-assign': 'error',
		'n/no-new-require': 'error',
		'n/no-path-concat': 'error',
		'n/process-exit-as-throw': 'error',

		// promise
		'promise/param-names': 'error',

		// jsdoc
		'jsdoc/require-jsdoc': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-yields': 'off',
		'jsdoc/tag-lines': 'off',
		'jsdoc/check-values': 'off',
		'jsdoc/check-tag-names': 'off',
		'jsdoc/no-undefined-types': 'off',
		'jsdoc/require-returns': 'off',
		'jsdoc/require-returns-type': 'off',
		'jsdoc/require-throws': 'off',
		'jsdoc/require-returns-description': 'off',

		// prettier
		'prettier/prettier': [
			'warn',
			{
				// 一行最多 100 字符
				printWidth: 100,
				// 使用 2 个空格缩进
				tabWidth: 2,
				// 行尾需要有分号
				semi: true,
				// 使用单引号
				singleQuote: true,
				// 如果对象中至少有一个属性需要引号，则所有的都添加
				quoteProps: 'consistent',
				// 箭头函数仅在有必要时(x) => x
				arrowParens: 'avoid',
				// 大括号内的首尾需要空格
				bracketSpacing: true,
				// 末尾需要有逗号
				trailingComma: 'all',
				// 大括号内的首尾需要空格
				// 每个文件格式化的范围是文件的全部内容
				rangeStart: 0,
				rangeEnd: Number.POSITIVE_INFINITY,
				// 不需要写文件开头的 @prettier
				requirePragma: false,
				// 不需要自动在文件开头插入 @prettier
				insertPragma: false,

				// 根据显示样式决定 html 要不要折行
				htmlWhitespaceSensitivity: 'css',
				// 换行符 auto
				endOfLine: 'auto',
				// vue 文件中的 script 和 style 内不用缩进
				vueIndentScriptAndStyle: false,
				// html, vue, jsx 中每个属性占一行
				singleAttributePerLine: false,
			},
		],
	},
};
