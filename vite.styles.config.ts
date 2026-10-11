import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `bun run styles:build` writes styles-demo/styles.html: five candidate looks, five slides each.
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [viteSingleFile()],
  build: { target: 'esnext', outDir: 'styles-demo', emptyOutDir: true, rollupOptions: { input: 'styles.html' } },
});
