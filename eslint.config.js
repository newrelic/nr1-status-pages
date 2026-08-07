const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const promise = require('eslint-plugin-promise');
const eslintComments = require('eslint-plugin-eslint-comments');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'tmp/**'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['eslint.config.js', '.prettierrc.js', 'babel.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      promise,
      'eslint-comments': eslintComments,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: require('@babel/eslint-parser'),
      globals: {
        ...globals.browser,
        ...globals.jest,
        __nr: true,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...promise.configs.recommended.rules,
      ...eslintComments.configs.recommended.rules,
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
      'import/no-unresolved': 'off',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
