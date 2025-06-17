import { describe, expect, test } from "vitest";
import * as lib from "./index";

describe("index exports", () => {
	test("should export all functions", () => {
		expect(lib.readAsArrayBuffer).toBeDefined();
		expect(lib.safeReadAsArrayBuffer).toBeDefined();
		expect(lib.readAsBinaryString).toBeDefined();
		expect(lib.safeReadAsBinaryString).toBeDefined();
		expect(lib.readAsDataUrl).toBeDefined();
		expect(lib.safeReadAsDataUrl).toBeDefined();
		expect(lib.readAsText).toBeDefined();
		expect(lib.safeReadAsText).toBeDefined();
		expect(lib.isString).toBeDefined();
		expect(lib.isArrayBuffer).toBeDefined();
	});

	test("functions should be callable", async () => {
		const file = new File(["test"], "test.txt", { type: "text/plain" });

		const arrayBuffer = await lib.readAsArrayBuffer(file);
		expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);

		const text = await lib.readAsText(file);
		expect(text).toBe("test");

		const binaryString = await lib.readAsBinaryString(file);
		expect(binaryString).toBe("test");

		const dataUrl = await lib.readAsDataUrl(file);
		expect(dataUrl).toContain("data:text/plain;base64,");

		expect(lib.isString("test")).toBe(true);
		expect(lib.isArrayBuffer(arrayBuffer)).toBe(true);
	});
});
