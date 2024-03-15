const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

module.exports = {
  extends: ['standard-with-typescript'],
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  parserOptions: {
    project,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts']
      },
      typescript: {
        project
      }
    }
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  rules: {
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/member-delimiter-style': 'off'
  }
}
