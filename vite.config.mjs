import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'src/frontend',
	css: {
		postcss: {
			plugins: [autoprefixer]
		}
	},
	build: {
		outDir: fileURLToPath(new URL('dist/frontend/', import.meta.url)),
		chunkSizeWarningLimit: 1_000, // 1 MB
		emptyOutDir: true
	}
});
