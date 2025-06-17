import { describe, expect, test } from "vitest";
import { isString, isArrayBuffer } from "./utils";

describe("utils", () => {
	describe("isString", () => {
		test("should return true for string values", () => {
			expect(isString("hello")).toBe(true);
			expect(isString("")).toBe(true);
			expect(isString("123")).toBe(true);
		});

		test("should return false for non-string values", () => {
			expect(isString(null)).toBe(false);
			expect(isString(undefined as unknown as string)).toBe(false);
			expect(isString(new ArrayBuffer(8))).toBe(false);
			expect(isString(123 as unknown as string)).toBe(false);
			expect(isString({} as unknown as string)).toBe(false);
			expect(isString([] as unknown as string)).toBe(false);
		});
	});

	describe("isArrayBuffer", () => {
		test("should return true for ArrayBuffer values", () => {
			expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
			expect(isArrayBuffer(new ArrayBuffer(0))).toBe(true);
		});

		test("should return false for non-ArrayBuffer values", () => {
			expect(isArrayBuffer(null)).toBe(false);
			expect(isArrayBuffer(undefined as unknown as ArrayBuffer)).toBe(false);
			expect(isArrayBuffer("hello")).toBe(false);
			expect(isArrayBuffer(123 as unknown as ArrayBuffer)).toBe(false);
			expect(isArrayBuffer({} as unknown as ArrayBuffer)).toBe(false);
			expect(isArrayBuffer([] as unknown as ArrayBuffer)).toBe(false);
		});
	});
});
