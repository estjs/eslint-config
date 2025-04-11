import { configPrettier, pluginPrettier } from '../plugins';
import { GLOB_VUE } from '../globs';
const prettierConflictRules = { ...configPrettier.rules };
prettierConflictRules['vue/html-self-closing'] = undefined;

export function prettier(overrides = {}, enableBiome = false) {
  return [
    {
      plugins: {
        prettier: pluginPrettier,
      },
      files: [enableBiome ? GLOB_VUE : '*'],
      rules: {
        ...prettierConflictRules,
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

            ...overrides,
          },
        ],
      },
    },
  ];
}
