import { describe, test, expect, vi } from "vitest";
import { readAsBinaryString } from "../read-as-binary-string";

describe("readAsBinaryString", () => {
  test("should read file as binary string", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const result = await readAsBinaryString(file);
    expect(result).toBe("foo");
  });

  test("should read file as binary string with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const result = await readAsBinaryString(file, { fileReader });
    expect(result).toBe("foo");
  });

  test("should read file as binary string with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const result = await readAsBinaryString(file, {
      fileReader,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onProgress,
      onError,
    });
    expect(result).toBe("foo");
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
