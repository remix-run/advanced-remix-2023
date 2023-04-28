import { LRUCache } from "lru-cache";

export function createCache<T>() {
  type V = T extends {} ? T : any;

  return {
    set(key: string, value: V) {},
    get(key: string): V | undefined {},
    delete(key: string) {},
    dispose() {},
  };
}
