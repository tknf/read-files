import { describe, test, expect, vi } from "vitest";
import { readAsText, safeReadAsText } from "../read-as-text";

describe("readAsText", () => {
  test("should read file as text", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const result = await readAsText(file);
    expect(result).toBe("foo");
  });

  test("should read file as text with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const result = await readAsText(file, { fileReader });
    expect(result).toBe("foo");
  });

  test("should read file as text with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const result = await readAsText(file, {
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

describe("safeReadAsText", () => {
  test("should read file as text", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const { result, error } = await safeReadAsText(file);
    expect(result).toBe("foo");
    expect(error).toBeNull();
  });

  test("should read file as text with custom file reader", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const { result, error } = await safeReadAsText(file, { fileReader });
    expect(result).toBe("foo");
    expect(error).toBeNull();
  });

  test("should read file as text with custom file reader and event handlers", async () => {
    const file = new File(["foo"], "foo.txt", { type: "text/plain" });
    const fileReader = new FileReader();
    const onLoad = vi.fn();
    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onProgress = vi.fn();
    const onError = vi.fn();
    const { result, error } = await safeReadAsText(file, {
      fileReader,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onProgress,
      onError,
    });
    expect(result).toBe("foo");
    expect(error).toBeNull();
    expect(onLoad).toHaveBeenCalled();
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadEnd).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
