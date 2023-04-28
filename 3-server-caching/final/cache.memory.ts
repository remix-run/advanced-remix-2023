export function createMemoryCache<T>() {
  let cache = new Map();

  return {
    set(key: string, value: T) {
      cache.set(key, value);
    },
    get(key: string): T | undefined {
      return cache.get(key);
    },
    delete(key: string) {
      cache.delete(key);
    },
    dispose() {
      cache.clear();
    },
  };
}
