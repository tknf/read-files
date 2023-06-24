import type { ReadFileResultType } from "./types";

export function isString(val: ReadFileResultType): val is string {
  return typeof val !== "undefined" && val !== null && typeof val === "string";
}

export function isArrayBuffer(val: ReadFileResultType): val is ArrayBuffer {
  return typeof val !== "undefined" && val !== null && typeof val !== "string";
}
