import {defineConfig} from 'vite';

export default defineConfig({
  // Base public path for GitHub Pages
  base: '/scream-ui/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    fs: {
      // Allow serving files from the monorepo root (for workspace links)
      allow: ['../..'],
    },
  },
});
