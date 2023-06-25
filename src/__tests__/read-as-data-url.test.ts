import { describe, test, expect, vi } from "vitest";
import { readAsDataUrl, safeReadAsDataUrl } from "../read-as-data-url";

describe("readAsDataUrl", () => {
  test("should read file as data url", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const result = await readAsDataUrl(file);
    expect(result).toBe("data:text/plain;base64,Zm9v");
  });

  test("should read file as data url with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const result = await readAsDataUrl(file, { fileReader });
    expect(result).toBe("data:text/plain;base64,Zm9v");
  });

  test("should read file as data url with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const result = await readAsDataUrl(file, {
      fileReader,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onProgress,
      onError,
    });
    expect(result).toBe("data:text/plain;base64,Zm9v");
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

describe("safeReadAsDataUrl", () => {
  test("should read file as data url", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const { result, error } = await safeReadAsDataUrl(file);
    expect(result).toBe("data:text/plain;base64,Zm9v");
    expect(error).toBeNull();
  });

  test("should read file as data url with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const { result, error } = await safeReadAsDataUrl(file, { fileReader });
    expect(result).toBe("data:text/plain;base64,Zm9v");
    expect(error).toBeNull();
  });

  test("should read file as data url with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const { result, error } = await safeReadAsDataUrl(file, {
      fileReader,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onProgress,
      onError,
    });
    expect(result).toBe("data:text/plain;base64,Zm9v");
    expect(error).toBeNull();
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
