module.exports = {
  root: true,
  extends: ['@config/eslint'].map(require.resolve),
  parserOptions: {
    include: ['*.ts', '*.tsx', '*.d.ts'],
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
}
