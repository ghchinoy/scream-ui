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
      external: [/^@material\/web\/.*/, 'lit', 'lit/decorators.js', '@chenglou/pretext', /^@ghchinoy\/lit-audio-ui.*/, /^@lit\/context.*/],
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
          globals: (id) => {
            if (id === 'lit') return 'Lit';
            if (id === 'lit/decorators.js') return 'LitDecorators';
            if (id === '@chenglou/pretext') return 'Pretext';
            if (id.startsWith('@material/web/')) {
               return id.replace('@material/web/', 'MaterialWeb_').replace(/[-\/]/g, '_');
            }
            return id;
          },
        }
      ],
    },
  },
});
