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
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'ScreamAudioUI',
    },
    rollupOptions: {
      external: [/^lit/, /^@material\/web/, 'three'],
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
          globals: (id) => {
            if (id.startsWith('lit')) return 'Lit';
            if (id.startsWith('@material/web')) return 'MaterialWeb';
            if (id === 'three') return 'THREE';
            return id;
          },
        }
      ],
    },
  },
});
