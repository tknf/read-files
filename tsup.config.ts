import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  dts: true,
  clean: true,
  format: ["esm", "iife"],
  outExtension(ctx) {
    let ext = ".js";
    if (ctx.format === "cjs") ext = ".cjs";
    if (ctx.format === "esm") ext = ".esm.js";
    if (ctx.format === "iife") ext = ".js";
    return {
      js: ext,
    };
  },
  target: "es2015",
});
