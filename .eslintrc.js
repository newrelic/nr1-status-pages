module.exports = {
  root: true,
  ignorePatterns: ['node_modules/**', 'dist/**', 'tmp/**'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    jest: true,
    es2022: true,
  },
  globals: {
    __nr: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:promise/recommended',
    'plugin:eslint-comments/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'promise', 'eslint-comments', 'prettier'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    'react/no-unescaped-entities': 'off',
    'react-hooks/set-state-in-effect': 'off',
  },
  overrides: [
    {
      files: ['.eslintrc.js', '.prettierrc.js', 'babel.config.js'],
      parserOptions: { sourceType: 'script' },
      env: { node: true },
    },
  ],
};
