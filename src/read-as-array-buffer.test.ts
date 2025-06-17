import { describe, expect, test, vi } from "vitest";
import { readAsArrayBuffer, safeReadAsArrayBuffer } from "./read-as-array-buffer";

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

	test("should read Blob as ArrayBuffer", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const result = await readAsArrayBuffer(blob);
		expect(result).toBeInstanceOf(ArrayBuffer);
	});

	test("should throw TypeError when FileReader result is not ArrayBuffer", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'result', { value: "not an ArrayBuffer" });
					this.dispatchEvent(new ProgressEvent('load'));
				}, 0);
			}
		});

		await expect(readAsArrayBuffer(file, { fileReader: mockFileReader }))
			.rejects
			.toThrow("Expected ArrayBuffer result from FileReader");
	});

	test("should reject when FileReader encounters an error", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsArrayBuffer(file, { fileReader: mockFileReader }))
			.rejects
			.toThrow("Mock error");
	});

	test("should reject when FileReader encounters an error without onError callback", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		// Explicitly pass options without onError
		await expect(readAsArrayBuffer(file, { fileReader: mockFileReader, onError: undefined }))
			.rejects
			.toThrow("Mock error");
	});

	test("should reject with null when FileReader error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'error', { value: null });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsArrayBuffer(file, { fileReader: mockFileReader }))
			.rejects
			.toBe(null);
	});

	test("should not call onError when error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		const onError = vi.fn();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'error', { value: null });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsArrayBuffer(file, { fileReader: mockFileReader, onError }))
			.rejects
			.toBe(null);
		
		expect(onError).not.toHaveBeenCalled();
	});
});

describe("safeReadAsArrayBuffer", () => {
	test("should read file as ArrayBuffer", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const { result, error } = await safeReadAsArrayBuffer(file);
		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(error).toBeNull();
	});

	test("should read file as ArrayBuffer with custom file reader", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const fileReader = new FileReader();
		const { result, error } = await safeReadAsArrayBuffer(file, { fileReader });
		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(error).toBeNull();
	});

	test("should read file as ArrayBuffer with custom file reader and event handlers", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const fileReader = new FileReader();
		const onLoad = vi.fn();
		const onLoadStart = vi.fn();
		const onLoadEnd = vi.fn();
		const onProgress = vi.fn();
		const onError = vi.fn();
		const { result, error } = await safeReadAsArrayBuffer(file, {
			fileReader,
			onLoad,
			onLoadStart,
			onLoadEnd,
			onProgress,
			onError,
		});
		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(error).toBeNull();
		expect(onLoad).toHaveBeenCalled();
		expect(onLoadStart).toHaveBeenCalled();
		expect(onLoadEnd).toHaveBeenCalled();
		expect(onProgress).toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();
	});

	test("should read Blob as ArrayBuffer", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const { result, error } = await safeReadAsArrayBuffer(blob);
		expect(result).toBeInstanceOf(ArrayBuffer);
		expect(error).toBeNull();
	});

	test("should handle FileReader errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsArrayBuffer(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Mock error");
	});

	test("should handle TypeError gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'result', { value: "not an ArrayBuffer" });
					this.dispatchEvent(new ProgressEvent('load'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsArrayBuffer(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Expected ArrayBuffer result from FileReader");
	});

	test("should handle non-DOMException errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsArrayBuffer', {
			value: function() {
				setTimeout(() => {
					const error = new Error("Generic error");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsArrayBuffer(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Generic error");
		expect(error?.name).toBe("ReadFileError");
	});
});
