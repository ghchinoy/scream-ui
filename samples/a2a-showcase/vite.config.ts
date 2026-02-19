import {defineConfig} from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080', // Host proxy
        ws: true,
      },
      '/api': {
        target: 'http://localhost:8080',
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});