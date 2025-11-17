import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      rollupTypes: true,
      skipDiagnostics: true, // Skip TypeScript errors during declaration generation
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'konva',
        'react-konva',
        '@helix/core',
        '@helix/media',
        '@helix/timeline',
      ],
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2020',
  },
});
