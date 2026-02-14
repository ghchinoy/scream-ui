import {defineConfig} from 'vite';

export default defineConfig({
  // Base public path
  base: './',
  root: 'demo',
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
});
