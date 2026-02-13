import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served in production (e.g. GitHub Pages).
  // If you host this on GitHub Pages at https://username.github.io/scream-ui/,
  // this must be set to '/scream-ui/'. 
  // If you use a custom domain, you can safely remove this line or set it to '/'.
  base: '/scream-ui/',
  
  build: {
    // Builds the index.html demo site into 'dist'
    outDir: 'dist',
  }
});
