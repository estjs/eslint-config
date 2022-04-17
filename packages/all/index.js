const { isPackageExists } = require('local-pkg')

const isVueExists = isPackageExists('vue')
const eslintList = ['@estjs/eslint-config-prettier']

if (isVueExists) {
  const Vue = require('vue')
  eslintList.push(Vue.version.startsWith('2.') ? '@estjs/eslint-config-vue2' : '@estjs/eslint-config-vue')
}
module.exports = {
  extends: eslintList,
}
