/*
 * @Author: hexujie
 * @Date: 2020-02-10 15:15:10
 * @LastEditTime: 2022-03-05 19:57:29
 * @LastEditors: zhangguijun8
 * @Description:
 * @FilePath: /pc-nirvana/.eslintrc.js
 */
module.exports = {
  // parser: 'babel-eslint',
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    // sourceType: 'module',
  },
  rule: {
  },
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
  },
};
