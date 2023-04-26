const fetch = require("../ghFetch");

module.exports = async ({ url }) => {
  let query = url.searchParams.get("q");
  console.log({ query });
  if (!query) return null;

  let res = await fetch(
    `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
  );

  let json = await res.json();

  return { query, ...json };
};
