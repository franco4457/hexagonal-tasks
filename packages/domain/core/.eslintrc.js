module.exports = {
  // env: {
  //   browser: true,
  //   es2021: true,
  //   node: true
  // },
  root: true,
  extends: ['@config/eslint'].map(require.resolve),
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module'
  // },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  // ignorePatterns: ['node_modules/', 'dist/', 'build/']
  rules: {
    // "import/export": "off",
    //   '@typescript-eslint/space-before-function-paren': 'off',
    //   '@typescript-eslint/no-misused-promises': 'off',
    //   '@typescript-eslint/indent': 'off',
    //   '@typescript-eslint/brace-style': 'off',
    //   '@typescript-eslint/member-delimiter-style': 'off'
  }
}
