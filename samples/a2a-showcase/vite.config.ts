import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/invoke': {
        target: 'http://127.0.0.1:8080',
      },
      '/.well-known': {
        target: 'http://127.0.0.1:8080',
      }
    },
  },
  build: {
    outDir: 'dist',
  },
});