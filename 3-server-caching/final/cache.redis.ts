import { createClient, type RedisClientOptions } from "redis";

export function createCache(options?: RedisClientOptions) {
  let client = createClient(options);
  client.connect();

  function ensureConnection() {
    return client.isOpen ? Promise.resolve() : client.connect();
  }

  return {
    async set(key: string, value: string) {
      await ensureConnection();
      return client.set(key, JSON.stringify(value));
    },
    async get(key: string) {
      await ensureConnection();
      let val = await client.get(key);
      return JSON.parse(val || "null");
    },
    async delete(key: string) {
      await ensureConnection();
      return client.del(key);
    },
    async dispose() {
      if (client.isOpen) {
        return client.disconnect();
      }
    },
  };
}
