import type { ReadFilePromiseOptions } from "./types";
import { isString } from "./utils";

/**
 * Asynchronously reads a File or Blob as a data URL.
 *
 * This function provides a Promise-based wrapper around the FileReader API
 * for reading files as data URLs, which include the file's media type and base64-encoded data.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to the file content as a data URL string
 * @throws TypeError if the FileReader result is not a string
 * @throws DOMException if the file reading operation fails
 *
 * @example
 * ```typescript
 * const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' });
 * const dataUrl = await readAsDataUrl(file);
 * console.log(dataUrl); // "data:text/plain;base64,SGVsbG8="
 * ```
 */
export async function readAsDataUrl(
	data: File | Blob,
	options: ReadFilePromiseOptions<string> = {}
) {
	const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError } = options;
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
		reader.readAsDataURL(data);
	});
}

/**
 * Safely reads a File or Blob as a data URL without throwing errors.
 *
 * This function wraps readAsDataUrl in a try-catch and returns a result object
 * containing either the successful result or error information.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to an object containing either result or error
 *
 * @example
 * ```typescript
 * const file = new File(['Hello'], 'hello.txt', { type: 'text/plain' });
 * const { result, error } = await safeReadAsDataUrl(file);
 *
 * if (error) {
 *   console.error('Failed to read file:', error.message);
 * } else {
 *   console.log('Data URL:', result);
 * }
 * ```
 */
export async function safeReadAsDataUrl(
	data: File | Blob,
	options: ReadFilePromiseOptions<string> = {}
) {
	try {
		const result = await readAsDataUrl(data, options);
		return { result, error: null } as const;
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		if (error instanceof DOMException) {
			return { result: null, error } as const;
		}
		return { result: null, error: new DOMException(error.message, "ReadFileError") };
	}
}
