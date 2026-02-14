import {defineConfig} from 'vite';

export default defineConfig({
  // Base public path
  base: '/',
  server: {
    fs: {
      allow: ['.'],
    },
  },
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        main: 'demo/index.html',
      },
    },
    emptyOutDir: true,
  },
});
