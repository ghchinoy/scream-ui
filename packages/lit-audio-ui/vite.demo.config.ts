import {defineConfig} from 'vite';

export default defineConfig({
  // Base public path
  base: './',
  root: 'demo',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
});
