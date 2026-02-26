import { defineConfig } from 'tsup'
export default defineConfig({
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['cjs'],
	clean: true,
	outExtension({ format }) {return { js: format === 'cjs' ? '.cjs' : '.js' }},
	esbuildOptions(options, context) {options.outdir = `dist/`},
})