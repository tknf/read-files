// File reading functions
export { readAsArrayBuffer, safeReadAsArrayBuffer } from "./read-as-array-buffer";
export { readAsBinaryString, safeReadAsBinaryString } from "./read-as-binary-string";
export { readAsDataUrl, safeReadAsDataUrl } from "./read-as-data-url";
export { readAsText, safeReadAsText, type ReadAsTextOptions } from "./read-as-text";

// Type definitions
export type { ReadFilePromiseOptions, ReadFileResultType } from "./types";

// Utility functions
export { isString, isArrayBuffer } from "./utils";
