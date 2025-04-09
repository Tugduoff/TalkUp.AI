import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@styles': '/src/styles',
      '@components': '/src/components',
      '@routes': '/src/routes',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@stores': '/src/stores',
      '@assets': '/src/assets',
      '@types': '/src/types',
      '@api': '/src/api',
    },
  },
});
