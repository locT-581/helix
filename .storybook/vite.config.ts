import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@storybook/blocks'],
  },
});
