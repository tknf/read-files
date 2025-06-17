import type { ReadFilePromiseOptions } from "./types";
import { isString } from "./utils";

/**
 * Asynchronously reads a File or Blob as a binary string.
 *
 * This function provides a Promise-based wrapper around the FileReader API
 * for reading files as binary strings, where each byte is represented as a character.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to the file content as a binary string
 * @throws TypeError if the FileReader result is not a string
 * @throws DOMException if the file reading operation fails
 *
 * @example
 * ```typescript
 * const file = new File(['Hello'], 'data.txt', { type: 'text/plain' });
 * const binaryString = await readAsBinaryString(file);
 * console.log(binaryString); // "Hello"
 * ```
 */
export async function readAsBinaryString(
	data: File | Blob,
	options: ReadFilePromiseOptions<string> = {}
) {
	const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError } = options;
	const reader = fileReader ?? new FileReader();
	return new Promise<string>((resolve, reject) => {
		reader.addEventListener("load", (e) => {
			const { result } = reader;
			if (!isString(result)) {
				reject(new TypeError("Expected string result from FileReader"));
				return;
			}
			onLoad?.(e, result);
			resolve(result);
		});
		reader.addEventListener("loadend", (e) => {
			const { result } = reader;
			onLoadEnd?.(e, result as string);
		});
		reader.addEventListener("error", (e) => {
			const { error } = reader;
			if (error) {
				onError?.(e, error);
			}
			reject(error);
		});
		if (onLoadStart) {
			reader.addEventListener("loadstart", onLoadStart);
		}
		if (onProgress) {
			reader.addEventListener("progress", onProgress);
		}
		reader.readAsBinaryString(data);
	});
}

/**
 * Safely reads a File or Blob as a binary string without throwing errors.
 *
 * This function wraps readAsBinaryString in a try-catch and returns a result object
 * containing either the successful result or error information.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to an object containing either result or error
 *
 * @example
 * ```typescript
 * const file = new File(['Hello'], 'data.txt', { type: 'text/plain' });
 * const { result, error } = await safeReadAsBinaryString(file);
 *
 * if (error) {
 *   console.error('Failed to read file:', error.message);
 * } else {
 *   console.log('Binary string:', result);
 * }
 * ```
 */
export async function safeReadAsBinaryString(
	data: File | Blob,
	options: ReadFilePromiseOptions<string> = {}
) {
	try {
		const result = await readAsBinaryString(data, options);
		return { result, error: null } as const;
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		if (error instanceof DOMException) {
			return { result: null, error } as const;
		}
		return { result: null, error: new DOMException(error.message, "ReadFileError") };
	}
}
