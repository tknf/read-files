import { readFileSync } from "node:fs";
import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

const date = {
  day: new Date().getDate(),
  month: "January February March April May June July August September October November December".split(" ")[
    new Date().getMonth()
  ],
  year: new Date().getFullYear(),
};

function banner() {
  return `${`
/**
 * @LICENSE
 *
 * Read File Promise v${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 *
 * Copyright 2018-${date.year} ${packageJson.author}
 *
 * Released under the ${packageJson.license} License
 *
 * Released on: ${date.month} ${date.day}, ${date.year}
 */
  `.trim()}\n`;
}

function createESM(isProduction: boolean) {
  const config: RollupOptions = {
    input: "./src/index.ts",
    output: {
      dir: "./dist",
      entryFileNames: "index.esm.js",
      exports: "named",
      format: "esm",
      externalLiveBindings: false,
      freeze: false,
      sourcemap: true,
      banner: banner(),
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        include: ["./src/**/*.ts"],
        exclude: ["./src/**/*.test.ts"],
        declaration: true,
        declarationDir: "./dist",
      }),
      isProduction && terser({ compress: true }),
    ],
  };
  return config;
}

function createBundle(minify: boolean) {
  const config: RollupOptions = {
    input: "./src/index.ts",
    output: {
      dir: "./dist",
      entryFileNames: minify ? "index.min.js" : "index.js",
      exports: "named",
      format: "umd",
      externalLiveBindings: false,
      freeze: false,
      sourcemap: true,
      name: "readFilePromise",
      banner: banner(),
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        include: ["./src/**/*.ts"],
        exclude: ["./src/**/*.test.ts"],
        declaration: false,
      }),
      minify && terser({ compress: true }),
    ],
  };
  return config;
}

function bundle(options: RollupOptions) {
  const isDevelopment = options.watch;
  const isProduction = !isDevelopment;
  return [createESM(isProduction), createBundle(true), createBundle(false)];
}

export default bundle;
