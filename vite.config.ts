import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	root: 'src/frontend',
	build: {
		outDir: fileURLToPath(new URL('dist', import.meta.url)),
		chunkSizeWarningLimit: 1_000, // 1 MB
		emptyOutDir: true
	}
});
