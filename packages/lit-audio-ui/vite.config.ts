import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamAudioUI',
      fileName: (format) => `scream-audio-ui.${format}.js`
    },
    rollupOptions: {
      external: [
        /^lit/,
        /^@material\/web/
      ]
    }
  }
});
