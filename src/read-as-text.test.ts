import { describe, expect, test, vi } from "vitest";
import { readAsText, safeReadAsText } from "./read-as-text";

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

	test("should read file as text with encoding", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const result = await readAsText(file, { encoding: "utf-8" });
		expect(result).toBe("foo");
	});

	test("should read Blob as text", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const result = await readAsText(blob);
		expect(result).toBe("foo");
	});

	test("should throw TypeError when FileReader result is not string", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					Object.defineProperty(this, "result", { value: new ArrayBuffer(8) });
					this.dispatchEvent(new ProgressEvent("load"));
				}, 0);
			},
		});

		await expect(readAsText(file, { fileReader: mockFileReader })).rejects.toThrow(
			"Expected string result from FileReader"
		);
	});

	test("should reject when FileReader encounters an error", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, "error", { value: error });
					this.dispatchEvent(new ProgressEvent("error"));
				}, 0);
			},
		});

		await expect(readAsText(file, { fileReader: mockFileReader })).rejects.toThrow("Mock error");
	});

	test("should reject with null when FileReader error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					Object.defineProperty(this, "error", { value: null });
					this.dispatchEvent(new ProgressEvent("error"));
				}, 0);
			},
		});

		await expect(readAsText(file, { fileReader: mockFileReader })).rejects.toBe(null);
	});

	test("should not call onError when error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		const onError = vi.fn();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					Object.defineProperty(this, "error", { value: null });
					this.dispatchEvent(new ProgressEvent("error"));
				}, 0);
			},
		});

		await expect(readAsText(file, { fileReader: mockFileReader, onError })).rejects.toBe(null);

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

	test("should read file as text with encoding", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const { result, error } = await safeReadAsText(file, { encoding: "utf-8" });
		expect(result).toBe("foo");
		expect(error).toBeNull();
	});

	test("should read Blob as text", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const { result, error } = await safeReadAsText(blob);
		expect(result).toBe("foo");
		expect(error).toBeNull();
	});

	test("should handle FileReader errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, "error", { value: error });
					this.dispatchEvent(new ProgressEvent("error"));
				}, 0);
			},
		});

		const { result, error } = await safeReadAsText(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Mock error");
	});

	test("should handle TypeError gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					Object.defineProperty(this, "result", { value: new ArrayBuffer(8) });
					this.dispatchEvent(new ProgressEvent("load"));
				}, 0);
			},
		});

		const { result, error } = await safeReadAsText(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Expected string result from FileReader");
	});

	test("should handle non-DOMException errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();

		Object.defineProperty(mockFileReader, "readAsText", {
			value: function () {
				setTimeout(() => {
					const error = new Error("Generic error");
					Object.defineProperty(this, "error", { value: error });
					this.dispatchEvent(new ProgressEvent("error"));
				}, 0);
			},
		});

		const { result, error } = await safeReadAsText(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Generic error");
		expect(error?.name).toBe("ReadFileError");
	});
});
