const token = process.env.GH;
import { createMemoryCache } from "./cache.memory";

let cache = createMemoryCache();

export async function fetchGitHub(path: string) {
  let cached = cache.get(path);
  if (cached) {
    console.log("✅ cache hit", path);
    return Promise.resolve(cached);
  }

  let headers = new Headers();
  if (token) {
    headers.append("Authorization", `token ${token}`);
  }

  let res = await fetch(`https://api.github.com${path}`, { headers });
  let json = await res.json();
  cache.set(path, json);

  return json;
}

export async function fetchMarkdown({
  md,
  org,
  repo,
}: {
  md: string;
  org: string;
  repo: string;
}) {
  if (md.trim() === "") {
    return null;
  }

  let cacheKey = `${md}:${org}:${repo}`;
  let cached = cache.get(cacheKey);
  if (cached) {
    console.log("✅ cache hit: md");
    return Promise.resolve(cached);
  }

  let htmlRes = await fetch(`https://api.github.com/markdown`, {
    method: "post",
    body: JSON.stringify({
      text: md,
      mode: "gfm",
      context: `${org}/${repo}`,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  let html = await htmlRes.text();
  cache.set(cacheKey, html);

  return html;
}
