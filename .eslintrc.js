module.exports = {
  root: true,
  extends: ['@config/eslint'].map(require.resolve),
  ignorePatterns: ['vistes.config.ts']
}
