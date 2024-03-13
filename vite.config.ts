import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'src/frontend',
	build: {
		outDir: fileURLToPath(new URL('dist/frontend/', import.meta.url)),
		chunkSizeWarningLimit: 1_000, // 1 MB
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		}
	}
});
