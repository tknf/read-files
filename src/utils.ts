import type { ReadFileResultType } from "./types";

/**
 * Type guard to check if a value is a string.
 * Safely determines if the FileReader result is a string type.
 * 
 * @param val - The value to check
 * @returns True if the value is a non-null, non-undefined string
 */
export function isString(val: ReadFileResultType): val is string {
	return typeof val !== "undefined" && val !== null && typeof val === "string";
}

/**
 * Type guard to check if a value is an ArrayBuffer.
 * Safely determines if the FileReader result is an ArrayBuffer type.
 * 
 * @param val - The value to check
 * @returns True if the value is a non-null, non-undefined ArrayBuffer
 */
export function isArrayBuffer(val: ReadFileResultType): val is ArrayBuffer {
	return typeof val !== "undefined" && val !== null && val instanceof ArrayBuffer;
}
