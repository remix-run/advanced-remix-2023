import { createClient, type RedisClientOptions } from "redis";

export function createCache(options?: RedisClientOptions) {
  return {
    async set(key: string, value: string) {},
    async get(key: string) {},
    async delete(key: string) {},
    async dispose() {},
  };
}
