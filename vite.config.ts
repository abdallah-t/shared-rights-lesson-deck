import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `bun run build` writes deck/index.html with script, styles and fonts inlined.
// Only the images in deck/assets sit beside it, so the deck opens with a double-click.
export default defineConfig({
  base: './',
  plugins: [viteSingleFile()],
  server: { port: 5173 },
  build: { target: 'esnext', outDir: 'deck', emptyOutDir: true },
});
