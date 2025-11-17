import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@helix/core': resolve(__dirname, '../core/src'),
      '@helix/media': resolve(__dirname, '../media/src'),
      '@helix/audio': resolve(__dirname, '../audio/src'),
      '@helix/timeline': resolve(__dirname, '../timeline/src'),
      '@helix/canvas': resolve(__dirname, '../canvas/src'),
      '@helix/studio': resolve(__dirname, '../studio/src'),
      '@helix/ui': resolve(__dirname, '../ui/src'),
    },
  },
  optimizeDeps: {
    include: ['@helix/core', '@helix/media', '@helix/audio', '@helix/timeline', '@helix/canvas', '@helix/studio', '@helix/ui'],
  },
  build: {
    commonjsOptions: {
      include: [/@helix/, /node_modules/],
    },
  },
});
