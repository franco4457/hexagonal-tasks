module.exports = {
  root: true,
  extends: ['@config/eslint/base'],
  parserOptions: {
    include: ['*.ts', '*.tsx', '*.d.ts', './src/*.ts'],
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  rules: {}
}
