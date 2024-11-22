import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react-markdown', 'rehype-raw', 'rehype-highlight', 'remark-gfm']
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
      external: ['highlight.js/styles/github-dark.css']
    },
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
});
