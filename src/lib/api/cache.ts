const store = new Map<string, unknown>();

export const cachedFetch = async <T>(
  url: string,
  parse: (data: unknown) => T
): Promise<T> => {
  const cached = store.get(url);
  if (cached !== undefined) {
    return cached as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }

  const parsed = parse(await response.json());
  store.set(url, parsed);
  return parsed;
};

export const clearCache = (): void => {
  store.clear();
};

export const cacheSize = (): number => store.size;
