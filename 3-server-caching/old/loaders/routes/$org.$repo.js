const fetch = require("../ghFetch");

module.exports = async ({ params }) => {
  let [releases, repo] = await Promise.all([
    fetch(`https://api.github.com/repos/${params.org}/${params.repo}/releases`),
    fetch(`https://api.github.com/repos/${params.org}/${params.repo}`),
  ]);
  return { releases: await releases.json(), repo: await repo.json() };
};
