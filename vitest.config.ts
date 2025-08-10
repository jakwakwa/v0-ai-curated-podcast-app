import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const rootDir = path.dirname(fileURLToPath(new URL("./", import.meta.url)))

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		 coverage: { provider: "v8" },
		 pool: "threads",
		 poolOptions: {
			 threads: { singleThread: true },
		 },
	},
	// Avoid loading project PostCSS config during tests
	css: { postcss: {} },
	resolve: {
		alias: [
			// Map @/xxx → <repoRoot>/xxx
			{ find: /^@\//, replacement: path.join(rootDir, "/") },
		],
		conditions: ["import", "module", "browser", "default"],
		mainFields: ["module", "main"],
	},
	plugins: [],
})
