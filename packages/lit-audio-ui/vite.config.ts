import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamAudioUI',
      fileName: format => `scream-audio-ui.${format}.js`,
    },
    rollupOptions: {
      external: [/^lit/, /^@material\/web/, 'three'],
      output: {
        globals: (id) => {
          if (id.startsWith('lit')) return 'Lit';
          if (id.startsWith('@material/web')) return 'MaterialWeb';
          if (id === 'three') return 'THREE';
          return id;
        },
      },
    },
  },
});
