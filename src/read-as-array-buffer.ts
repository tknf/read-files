import type { ReadFilePromiseOptions } from "./types";
import { isArrayBuffer } from "./utils";

/**
 * Async function to read a file as an ArrayBuffer.
 * @param data File or Blob to read
 * @param options Read options
 */
export async function readAsArrayBuffer(data: File | Blob, options: ReadFilePromiseOptions<ArrayBuffer> = {}) {
  const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError } = options;
  const reader = fileReader ?? new FileReader();
  return new Promise<ArrayBuffer>((resolve, reject) => {
    reader.addEventListener("load", (e) => {
      const { result } = reader;
      if (!isArrayBuffer(result)) {
        throw new TypeError(`ArrayBuffer result is expected`);
      }
      onLoad?.(e, result as ArrayBuffer);
      resolve(result as ArrayBuffer);
    });
    reader.addEventListener("loadend", (e) => {
      const { result } = reader;
      onLoadEnd?.(e, result as ArrayBuffer);
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
    reader.readAsArrayBuffer(data);
  });
}
