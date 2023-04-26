import { createClient, type RedisClientOptions } from "redis";

export async function createRedisCache(options?: RedisClientOptions) {
  let client = createClient(options);
  await client.connect();

  return {
    set(key: string, value: any) {
      return client.set(key, value);
    },
    get(key: string) {
      return client.get(key);
    },
    delete(key: string) {
      return client.del(key);
    },
    async dispose() {
      await client.disconnect();
    },
  };
}
