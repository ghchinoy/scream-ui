import eslint from '@eslint/js';
import eslintPluginLit from 'eslint-plugin-lit';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      lit: eslintPluginLit,
    },
    rules: {
      ...eslintPluginLit.configs.recommended.rules,
    },
  },
);