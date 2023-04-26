import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

await client.set("key", "hooba!");
let value = await client.get("key");
console.log(value);

await client.del("key");
value = await client.get("key");
console.log(value);

await client.disconnect();
