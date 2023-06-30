// .prettierrc.js
module.exports = {
	// 一行最多 160 字符
	printWidth: 160,
	// 使用 2 个空格缩进
	tabWidth: 2,
	// 不使用缩进符，而使用空格
	useTabs: true,
	// 行尾需要有分号
	semi: true,
	// 使用单引号
	singleQuote: true,
	// 对象的 key 仅在必要时用引号
	quoteProps: 'consistent',
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
	// 使用默认的折行标准
	proseWrap: 'preserve',
	// 根据显示样式决定 html 要不要折行
	htmlWhitespaceSensitivity: 'css',
	// 换行符 auto
	endOfLine: 'auto',
	// vue 文件中的 script 和 style 内不用缩进
	vueIndentScriptAndStyle: false,
	// html, vue, jsx 中每个属性占一行
	singleAttributePerLine: false,
};
