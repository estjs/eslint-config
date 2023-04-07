/*
 * @Author: jiangxd<jiangxd2016@gmail.com>
 * @Date: 2023-04-06 20:07:35
 * @LastEditTime: 2023-04-07 22:50:21
 * @LastEditors: jiangxd<jiangxd2016@gmail.com>
 * @Description:
 * @FilePath: /eslint-config/packages/eslint-plugin/build.config.js
 */
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/utils/dirs',
    'src/index',
    'src/utils/worker-sort',
    'Src/utils/parser-short'
  ],
  clean: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
});
