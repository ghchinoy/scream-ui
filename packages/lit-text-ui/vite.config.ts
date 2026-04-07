import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamTextUI',
      formats: ['es', 'umd'],
      fileName: (format) => `scream-text-ui.${format}.js`,
    },
    rollupOptions: {
      external: [/^@material\/web\/.*/, 'lit', 'lit/decorators.js', '@chenglou/pretext'],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'umd',
          name: 'ScreamTextUI',
          entryFileNames: 'scream-text-ui.umd.js',
          globals: {
            'lit': 'Lit',
            'lit/decorators.js': 'LitDecorators',
            '@chenglou/pretext': 'Pretext'
          },
        }
      ],
    },
  },
});
