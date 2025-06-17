import type { ReadFilePromiseOptions } from "./types";
import { isString } from "./utils";

/**
 * Configuration options for text file reading operations.
 * Extends the base options with encoding support.
 */
export interface ReadAsTextOptions extends ReadFilePromiseOptions<string> {
	/**
	 * Character encoding to use when reading the file.
	 * If not specified, the browser's default encoding will be used.
	 * @example "UTF-8", "ISO-8859-1", "Shift_JIS"
	 */
	encoding?: string;
}

/**
 * Asynchronously reads a File or Blob as text.
 *
 * This function provides a Promise-based wrapper around the FileReader API
 * for reading files as text with optional character encoding support.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including encoding and event callbacks
 * @returns A Promise that resolves to the file content as a string
 * @throws TypeError if the FileReader result is not a string
 * @throws DOMException if the file reading operation fails
 *
 * @example
 * ```typescript
 * const file = new File(['Hello World'], 'hello.txt', { type: 'text/plain' });
 * const text = await readAsText(file);
 * console.log(text); // "Hello World"
 * ```
 *
 * @example
 * ```typescript
 * // With encoding
 * const text = await readAsText(file, { encoding: 'UTF-8' });
 * ```
 */
export async function readAsText(data: File | Blob, options: ReadAsTextOptions = {}) {
	const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError, encoding } = options;
	const reader = fileReader ?? new FileReader();
	return new Promise<string>((resolve, reject) => {
		const cleanup = () => {
			reader.removeEventListener("load", loadHandler);
			reader.removeEventListener("error", errorHandler);
			if (onLoadStart) {
				reader.removeEventListener("loadstart", onLoadStart);
			}
			if (onProgress) {
				reader.removeEventListener("progress", onProgress);
			}
		};

		const loadHandler = (e: ProgressEvent<FileReader>) => {
			const { result } = reader;
			if (!isString(result)) {
				cleanup();
				reject(new TypeError("Expected string result from FileReader"));
				return;
			}
			onLoad?.(e, result);
			cleanup();
			resolve(result);
		};

		const loadEndHandler = (e: ProgressEvent<FileReader>) => {
			const { result } = reader;
			onLoadEnd?.(e, result as string);
			reader.removeEventListener("loadend", loadEndHandler);
		};

		const errorHandler = (e: ProgressEvent<FileReader>) => {
			const { error } = reader;
			if (error) {
				onError?.(e, error);
			}
			cleanup();
			reject(error);
		};

		reader.addEventListener("load", loadHandler);
		reader.addEventListener("loadend", loadEndHandler);
		reader.addEventListener("error", errorHandler);
		if (onLoadStart) {
			reader.addEventListener("loadstart", onLoadStart);
		}
		if (onProgress) {
			reader.addEventListener("progress", onProgress);
		}
		reader.readAsText(data, encoding);
	});
}

/**
 * Safely reads a File or Blob as text without throwing errors.
 *
 * This function wraps readAsText in a try-catch and returns a result object
 * containing either the successful result or error information.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including encoding and event callbacks
 * @returns A Promise that resolves to an object containing either result or error
 *
 * @example
 * ```typescript
 * const file = new File(['Hello World'], 'hello.txt', { type: 'text/plain' });
 * const { result, error } = await safeReadAsText(file);
 *
 * if (error) {
 *   console.error('Failed to read file:', error.message);
 * } else {
 *   console.log('File content:', result);
 * }
 * ```
 */
export async function safeReadAsText(data: File | Blob, options: ReadAsTextOptions = {}) {
	try {
		const result = await readAsText(data, options);
		return { result, error: null } as const;
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		if (error instanceof DOMException) {
			return { result: null, error } as const;
		}
		return { result: null, error: new DOMException(error.message, "ReadFileError") };
	}
}
