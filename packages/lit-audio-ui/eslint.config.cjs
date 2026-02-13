const gts = require('gts');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const litPlugin = require('eslint-plugin-lit');

module.exports = [
  ...gts,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'lit': litPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { "argsIgnorePattern": "^_" }],
      ...litPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'scripts/']
  }
];