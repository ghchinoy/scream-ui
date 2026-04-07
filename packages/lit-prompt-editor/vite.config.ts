import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamPromptEditor',
      formats: ['es', 'umd'],
      fileName: (format) => `scream-prompt-editor.${format}.js`,
    },
    rollupOptions: {
      external: [/^lit/, /^@material\/web/, /^@chenglou\/pretext/],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'umd',
          name: 'ScreamPromptEditor',
          entryFileNames: 'scream-prompt-editor.umd.js',
          globals: {
            'lit': 'Lit',
            'lit/decorators.js': 'LitDecorators',
            '@chenglou/pretext': 'Pretext',
            '@chenglou/pretext/rich-inline': 'PretextRichInline'
          },
        }
      ],
    },
  },
});
