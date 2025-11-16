import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        types: resolve(__dirname, 'src/types/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts'),
        constants: resolve(__dirname, 'src/constants/index.ts'),
      },
      formats: ['es'],
      fileName: (_format: string, entryName: string) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2022',
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
