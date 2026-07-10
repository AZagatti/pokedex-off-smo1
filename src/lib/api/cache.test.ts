import { cachedFetch, cacheSize, clearCache } from "$lib/api/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

const parseValue = (data: unknown) => (data as { value: number }).value;

describe("cachedFetch", () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it("parses and caches the response", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ value: 1 }, { status: 200 }));

    const result = await cachedFetch("https://example.com/a", parseValue);

    expect(result).toBe(1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("reuses the cached value without refetching", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ value: 2 }, { status: 200 }));

    await cachedFetch("https://example.com/b", parseValue);
    await cachedFetch("https://example.com/b", parseValue);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(cacheSize()).toBe(1);
  });

  it("throws on a non-ok response and does not cache it", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 404 })
    );

    await expect(
      cachedFetch("https://example.com/missing", (d) => d)
    ).rejects.toThrow("404");
    expect(cacheSize()).toBe(0);
  });
});
