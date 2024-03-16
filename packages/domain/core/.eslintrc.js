module.exports = {
  root: true,
  extends: ['@config/eslint'].map(require.resolve),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  rules: {}
}
