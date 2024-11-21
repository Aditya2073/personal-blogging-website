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
    exclude: ['lucide-react'],
    include: ['@splinetool/runtime', '@splinetool/react-spline'],
  },
  build: {
    rollupOptions: {
      external: ['@splinetool/runtime', '@splinetool/react-spline'],
    },
    commonjsOptions: {
      include: [/@splinetool\/.*/],
    },
  },
});
