import { describe, expect, test, vi } from "vitest";
import { readAsDataUrl, safeReadAsDataUrl } from "./read-as-data-url";

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

	test("should read Blob as data url", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const result = await readAsDataUrl(blob);
		expect(result).toBe("data:text/plain;base64,Zm9v");
	});

	test("should throw TypeError when FileReader result is not string", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'result', { value: new ArrayBuffer(8) });
					this.dispatchEvent(new ProgressEvent('load'));
				}, 0);
			}
		});

		await expect(readAsDataUrl(file, { fileReader: mockFileReader }))
			.rejects
			.toThrow("Expected string result from FileReader");
	});

	test("should reject when FileReader encounters an error", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsDataUrl(file, { fileReader: mockFileReader }))
			.rejects
			.toThrow("Mock error");
	});

	test("should reject with null when FileReader error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'error', { value: null });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsDataUrl(file, { fileReader: mockFileReader }))
			.rejects
			.toBe(null);
	});

	test("should not call onError when error is null", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		const onError = vi.fn();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'error', { value: null });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		await expect(readAsDataUrl(file, { fileReader: mockFileReader, onError }))
			.rejects
			.toBe(null);
		
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

	test("should read Blob as data url", async () => {
		const blob = new Blob(["foo"], { type: "text/plain" });
		const { result, error } = await safeReadAsDataUrl(blob);
		expect(result).toBe("data:text/plain;base64,Zm9v");
		expect(error).toBeNull();
	});

	test("should handle FileReader errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					const error = new DOMException("Mock error", "NotReadableError");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsDataUrl(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Mock error");
	});

	test("should handle TypeError gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					Object.defineProperty(this, 'result', { value: new ArrayBuffer(8) });
					this.dispatchEvent(new ProgressEvent('load'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsDataUrl(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Expected string result from FileReader");
	});

	test("should handle non-DOMException errors gracefully", async () => {
		const file = new File(["foo"], "foo.txt", { type: "text/plain" });
		const mockFileReader = new FileReader();
		
		Object.defineProperty(mockFileReader, 'readAsDataURL', {
			value: function() {
				setTimeout(() => {
					const error = new Error("Generic error");
					Object.defineProperty(this, 'error', { value: error });
					this.dispatchEvent(new ProgressEvent('error'));
				}, 0);
			}
		});

		const { result, error } = await safeReadAsDataUrl(file, { fileReader: mockFileReader });
		expect(result).toBeNull();
		expect(error).toBeInstanceOf(DOMException);
		expect(error?.message).toBe("Generic error");
		expect(error?.name).toBe("ReadFileError");
	});
});
