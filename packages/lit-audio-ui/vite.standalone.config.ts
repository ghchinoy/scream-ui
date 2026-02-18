import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/standalone',
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamAudioUI',
      formats: ['es'],
      fileName: () => `scream-audio-ui.standalone.js`,
    },
    rollupOptions: {
      // STANDALONE BUILD: Bundle everything together
      external: [], 
      output: {
        preserveModules: false,
        inlineDynamicImports: true,
      },
    },
  },
});
