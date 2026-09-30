const js = require('@eslint/js');
const globals = require('globals');
const babelParser = require('@babel/eslint-parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const promise = require('eslint-plugin-promise');
const eslintComments = require('eslint-plugin-eslint-comments');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'tmp/**'],
  },
  js.configs.recommended,
  {
    ...react.configs.flat.recommended,
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs['recommended-latest'].rules,
  },
  importPlugin.flatConfigs.recommended,
  promise.configs['flat/recommended'],
  {
    plugins: { 'eslint-comments': eslintComments },
    rules: eslintComments.configs.recommended.rules,
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        __nr: true,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'import/no-unresolved': 'off',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['eslint.config.js', '.prettierrc.js', 'babel.config.js'],
    languageOptions: {
      sourceType: 'script',
      globals: globals.node,
    },
  },
];
