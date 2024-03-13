import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/backend/**/*.ts'],
	format: 'esm',
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'es2022',
	tsconfig: 'src/backend/tsconfig.json',
	outDir: 'dist/backend',
	bundle: false
});
