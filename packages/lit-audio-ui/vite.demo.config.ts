import {defineConfig} from 'vite';

export default defineConfig({
  // Base public path for GitHub Pages
  base: '/scream-ui/',
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
