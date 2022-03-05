/*
 * @Author: hexujie
 * @Date: 2020-02-10 15:15:10
 * @LastEditTime: 2022-03-05 12:16:41
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
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        vue: 'never',
      },
    ],
  },
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      },
    },
  },
};
