module.exports = (url, init = {}) => {
  init.headers = init.headers || {};
  init.headers["authorization"] = `token ${process.env.GH}`;
  return fetch(url, init);
};
