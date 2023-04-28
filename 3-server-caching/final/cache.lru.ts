import { LRUCache } from "lru-cache";

export function createCache<T>() {
  type V = T extends {} ? T : any;

  let cache = new LRUCache<string, V>({ max: 3 });

  return {
    set(key: string, value: any) {
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
