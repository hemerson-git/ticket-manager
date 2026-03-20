import { describe, it, expect } from "vitest";
import { getConvertedDateToUTC } from "./convertDateToUTC";

describe("getConvertedDateToUTC", () => {
  it("returns a Date instance", () => {
    const result = getConvertedDateToUTC(new Date("2024-06-15T00:00:00Z"));
    expect(result).toBeInstanceOf(Date);
  });

  it("preserves the UTC date components", () => {
    const input = new Date("2024-06-15T10:30:45Z");
    const result = getConvertedDateToUTC(input);

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(5); // June = 5 (zero-based)
    expect(result.getUTCDate()).toBe(15);
    expect(result.getUTCHours()).toBe(10);
    expect(result.getUTCMinutes()).toBe(30);
    expect(result.getUTCSeconds()).toBe(45);
  });

  it("handles start of year correctly", () => {
    const input = new Date("2024-01-01T00:00:00Z");
    const result = getConvertedDateToUTC(input);

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(0); // January = 0
    expect(result.getUTCDate()).toBe(1);
  });

  it("handles end of year correctly", () => {
    const input = new Date("2024-12-31T23:59:59Z");
    const result = getConvertedDateToUTC(input);

    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(11); // December = 11
    expect(result.getUTCDate()).toBe(31);
    expect(result.getUTCHours()).toBe(23);
    expect(result.getUTCMinutes()).toBe(59);
    expect(result.getUTCSeconds()).toBe(59);
  });

  it("returns a different Date object than the input", () => {
    const input = new Date("2024-06-15T00:00:00Z");
    const result = getConvertedDateToUTC(input);
    expect(result).not.toBe(input);
  });
});
