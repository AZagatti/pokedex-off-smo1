const store = new Map<string, unknown>();
const inFlight = new Map<string, Promise<unknown>>();

const load = async <T>(
  url: string,
  parse: (data: unknown) => T,
  fetchImpl: typeof fetch
): Promise<T> => {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  const parsed = parse(await response.json());
  store.set(url, parsed);
  return parsed;
};

export const cachedFetch = <T>(
  url: string,
  parse: (data: unknown) => T,
  fetchImpl: typeof fetch = fetch
): Promise<T> => {
  const cached = store.get(url);
  if (cached !== undefined) {
    return Promise.resolve(cached as T);
  }

  const pending = inFlight.get(url);
  if (pending) {
    return pending as Promise<T>;
  }

  const request = load(url, parse, fetchImpl);
  inFlight.set(url, request);

  const cleanup = async () => {
    try {
      await request;
    } catch {
      // the caller awaiting `request` handles the error
    } finally {
      inFlight.delete(url);
    }
  };
  cleanup();

  return request;
};

export const clearCache = (): void => {
  store.clear();
  inFlight.clear();
};

export const cacheSize = (): number => store.size;
