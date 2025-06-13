import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const aliases = {
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/assets': path.resolve(__dirname, 'src/assets'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/styles': path.resolve(__dirname, 'src/styles'),
  '@/routes': path.resolve(__dirname, 'src/routes'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
  '@/stores': path.resolve(__dirname, 'src/stores'),
  '@/types': path.resolve(__dirname, 'src/types'),
  '@/api': path.resolve(__dirname, 'src/api'),
  '@/services': path.resolve(__dirname, 'src/services'),
};

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      ...aliases,
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 8080,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.ts',
    css: true,
    exclude: ['tests/', 'node_modules/', 'dist/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '*.config.ts',
        '*.d.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/routeTree.gen.ts',
        'src/vite-env.d.ts',
        'eslint.config.js',
        'tests/',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
