import { describe, test, expect, vi } from "vitest";
import { readAsArrayBuffer } from "../read-as-array-buffer";

describe("readAsArrayBuffer", () => {
  test("should read file as ArrayBuffer", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const result = await readAsArrayBuffer(file);
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  test("should read file as ArrayBuffer with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const result = await readAsArrayBuffer(file, { fileReader });
    expect(result).toBeInstanceOf(ArrayBuffer);
  });

  test("should read file as ArrayBuffer with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const result = await readAsArrayBuffer(file, {
      fileReader,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onProgress,
      onError,
    });
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
