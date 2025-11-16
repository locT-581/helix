import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

/**
 * Vite configuration for @helix/ui package
 * 
 * Note: TypeScript declaration files (.d.ts) are disabled due to Stitches
 * type portability limitations. Users can still get type inference from
 * source files via TypeScript's module resolution.
 */
export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.stories.tsx',
        '**/*.config.ts',
      ],
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'stitches.config': resolve(__dirname, 'src/stitches.config.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@helix/core',
        '@stitches/react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-slider',
        '@radix-ui/react-switch',
        '@radix-ui/react-tooltip',
        'lucide-react',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
