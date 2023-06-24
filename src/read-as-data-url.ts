import type { ReadFilePromiseOptions } from "./types";
import { isString } from "./utils";

/**
 * Async function to read a file as an data url.
 * @param data File or Blob to read
 * @param options Read options
 */
export async function readAsDataUrl(data: File | Blob, options: ReadFilePromiseOptions<string> = {}) {
  const { fileReader, onLoad, onLoadStart, onLoadEnd, onProgress, onError } = options;
  const reader = fileReader ?? new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.addEventListener("load", (e) => {
      const { result } = reader;
      if (!isString(result)) {
        throw new TypeError(`String result is expected`);
      }
      onLoad?.(e, result as string);
      resolve(result as string);
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
    reader.readAsDataURL(data);
  });
}
