import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    open: '/demo/index.html',
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't wipe, so standalone build can coexist
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamAudioUI',
      formats: ['es', 'umd'],
      fileName: (format) => `scream-audio-ui.${format}.js`,
    },
    rollupOptions: {
      // DEFAULT BUILD: Externalize dependencies for standard Lit apps
      external: [/^lit/, /^@material\/web/, 'three', '@lit/context'],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'umd',
          name: 'ScreamAudioUI',
          entryFileNames: 'scream-audio-ui.umd.js',
          globals: {
            'lit': 'Lit',
            'lit/decorators.js': 'LitDecorators',
            '@lit/context': 'LitContext',
            'three': 'THREE',
            '@material/web/button/filled-button.js': 'MdFilledButton',
            '@material/web/button/outlined-button.js': 'MdOutlinedButton',
            '@material/web/icon/icon.js': 'MdIcon',
          },
        }
      ],
    },
  },
});
