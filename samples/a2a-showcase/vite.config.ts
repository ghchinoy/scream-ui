import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/invoke': {
        target: 'http://localhost:8080',
      },
      '/.well-known': {
        target: 'http://localhost:8080',
      }
    },
  },
  build: {
    outDir: 'dist',
  },
});