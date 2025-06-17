import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.test.ts"],
		globals: true,
		environment: "jsdom",
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**/*.ts"],
			exclude: ["src/types.ts", "src/**/*.test.ts"],
			thresholds: {
				branches: 95,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
	},
});
