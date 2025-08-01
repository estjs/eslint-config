import { configPrettier, pluginPrettier } from '../plugins';
import {
  GLOB_ALL,
  GLOB_CSS,
  GLOB_HTML,
  GLOB_JS,
  GLOB_JSON,
  GLOB_JSON5,
  GLOB_JSONC,
  GLOB_JSX,
  GLOB_LESS,
  GLOB_MARKDOWN,
  GLOB_SCSS,
  GLOB_TS,
  GLOB_TSX,
  GLOB_VUE,
  GLOB_YAML,
} from '../globs';

const prettierConflictRules = { ...configPrettier.rules };
prettierConflictRules['vue/html-self-closing'] = 'off';

export function prettier(overrides = {}, enableBiome = false, enableOxlint = false) {
  const prettierOptions = {
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
  };

  if (!enableOxlint) {
    return [
      {
        plugins: {
          prettier: pluginPrettier,
        },
        files: [enableBiome ? GLOB_VUE : GLOB_ALL],
        rules: {
          ...prettierConflictRules,
          'prettier/prettier': ['warn', prettierOptions],
        },
      },
    ];
  }
  return [
    {
      files: [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX],
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        ...prettierConflictRules,
        'prettier/prettier': [
          'warn',
          {
            ...prettierOptions,
            parser: 'oxc',
            plugins: ['@prettier/plugin-oxc'],
          },
        ],
      },
    },
    {
      files: [
        GLOB_VUE,
        GLOB_CSS,
        GLOB_LESS,
        GLOB_SCSS,
        GLOB_HTML,
        GLOB_JSON,
        GLOB_JSON5,
        GLOB_JSONC,
        GLOB_MARKDOWN,
        GLOB_YAML,
      ],
      plugins: {
        prettier: pluginPrettier,
      },
      rules: {
        ...prettierConflictRules,
        'prettier/prettier': ['warn', prettierOptions],
      },
    },
  ];
}
