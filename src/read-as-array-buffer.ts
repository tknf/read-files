import type { ReadFilePromiseOptions } from "./types";
import { isArrayBuffer } from "./utils";

/**
 * Asynchronously reads a File or Blob as an ArrayBuffer.
 *
 * This function provides a Promise-based wrapper around the FileReader API
 * for reading files as ArrayBuffer, which is useful for binary data processing.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to the file content as an ArrayBuffer
 * @throws TypeError if the FileReader result is not an ArrayBuffer
 * @throws DOMException if the file reading operation fails
 *
 * @example
 * ```typescript
 * const file = new File(['Hello World'], 'data.bin', { type: 'application/octet-stream' });
 * const buffer = await readAsArrayBuffer(file);
 * console.log(buffer.byteLength); // 11
 * ```
 */
export async function readAsArrayBuffer(
	data: File | Blob,
	options: ReadFilePromiseOptions<ArrayBuffer> = {}
) {
	const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError } = options;
	const reader = fileReader ?? new FileReader();
	return new Promise<ArrayBuffer>((resolve, reject) => {
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
			if (!isArrayBuffer(result)) {
				cleanup();
				reject(new TypeError("Expected ArrayBuffer result from FileReader"));
				return;
			}
			onLoad?.(e, result);
			cleanup();
			resolve(result);
		};

		const loadEndHandler = (e: ProgressEvent<FileReader>) => {
			const { result } = reader;
			onLoadEnd?.(e, result as ArrayBuffer);
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
		reader.readAsArrayBuffer(data);
	});
}

/**
 * Safely reads a File or Blob as an ArrayBuffer without throwing errors.
 *
 * This function wraps readAsArrayBuffer in a try-catch and returns a result object
 * containing either the successful result or error information.
 *
 * @param data - The File or Blob object to read
 * @param options - Configuration options including event callbacks
 * @returns A Promise that resolves to an object containing either result or error
 *
 * @example
 * ```typescript
 * const file = new File(['Hello World'], 'data.bin', { type: 'application/octet-stream' });
 * const { result, error } = await safeReadAsArrayBuffer(file);
 *
 * if (error) {
 *   console.error('Failed to read file:', error.message);
 * } else {
 *   console.log('Buffer size:', result.byteLength);
 * }
 * ```
 */
export async function safeReadAsArrayBuffer(
	data: File | Blob,
	options: ReadFilePromiseOptions<ArrayBuffer> = {}
) {
	try {
		const result = await readAsArrayBuffer(data, options);
		return { result, error: null } as const;
		// biome-ignore lint/suspicious/noExplicitAny:
	} catch (error: any) {
		if (error instanceof DOMException) {
			return { result: null, error } as const;
		}
		return { result: null, error: new DOMException(error.message, "ReadFileError") };
	}
}
