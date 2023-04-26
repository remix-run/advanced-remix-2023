const { json } = require("@remix-run/loader");
const fetch = require("../ghFetch");

module.exports = async ({ params }) => {
  let [{ release, html }, repo] = await Promise.all([
    getRelease(params),
    getRepo(params),
  ]);

  let maxAge = getMaxAge(release.published_at);

  return json(
    { html, release, repo },
    {
      headers: {
        "cache-control": `public, max-age=300, s-maxage=${maxAge}, stale-while-revalidate=31540000000`,
      },
    }
  );
};

async function getRepo(params) {
  let res = await fetch(
    `https://api.github.com/repos/${params.org}/${params.repo}`
  );
  return res.json();
}

async function getRelease(params) {
  let res = await fetch(
    `https://api.github.com/repos/${params.org}/${params.repo}/releases/tags/${params.release}`
  );
  let release = await res.json();

  if (release.body.trim() === "") {
    return { release, body: null };
  }

  let htmlRes = await fetch(`https://api.github.com/markdown`, {
    method: "post",
    body: JSON.stringify({
      text: release.body,
      mode: "gfm",
      context: `${params.org}/${params.repo}`,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  let html = await htmlRes.text();

  return { release, html };
}

function getMaxAge(publishedAt) {
  // If it was recently published, let's give the author a chance
  // to make edits, but after the first day, we'll aggressively cache
  // this for a month
  let oneDayMs = 8640000000;
  let millisecondsSincePublished = Date.now() - Date.parse(publishedAt);
  return millisecondsSincePublished < oneDayMs
    ? "1800" // 30 minutes
    : "2628000000"; // one month
}
