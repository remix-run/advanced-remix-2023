export function createMemoryCache<T>() {
  return {
    set(key: string, value: T) {},
    get(key: string): T | undefined {},
    delete(key: string) {},
    dispose() {},
  };
}
