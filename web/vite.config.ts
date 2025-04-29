import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

const aliases = {
  '@modules': path.resolve(__dirname, './src/modules'),
  '@components': path.resolve(__dirname, './src/components'),
  '@assets': path.resolve(__dirname, './src/assets'),
  '@utils': path.resolve(__dirname, './src/utils'),
  '@styles': path.resolve(__dirname, './src/styles'),
  '@routes': path.resolve(__dirname, './src/routes'),
  '@hooks': path.resolve(__dirname, './src/hooks'),
  '@stores': path.resolve(__dirname, './src/stores'),
  '@types': path.resolve(__dirname, './src/types'),
  '@api': path.resolve(__dirname, './src/api')
};

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: aliases,
  },
});
