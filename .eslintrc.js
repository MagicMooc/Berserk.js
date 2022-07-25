module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    amd: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  // parser: '@typescript-eslint/parser',
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module'
  // },
  // 2. 加入 prettier 的 eslint 插件
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 0
  }
};
