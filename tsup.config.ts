import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		dts: true,
		clean: true,
		target: "es2020",
		platform: "neutral",
	},
	{
		entry: {
			"read-files": "src/index.ts",
		},
		outExtension: () => ({ js: ".min.js" }),
		format: ["iife"],
		globalName: "ReadFilePromise",
		clean: false,
		target: "es2020",
		platform: "browser",
		outDir: "dist",
		minify: true,
	},
]);
