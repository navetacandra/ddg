const { request } = require("./utils");

/**
 *
 * @param {string} query
 * @param {'regular'|'image'|'video'|'news'|'map'} type
 */
exports.search = async (query, type) => {
  try {
    const apiURL = await getJS(query);

    if (!type || type == "regular") {
      return await regularSearch(apiURL.path, true);
    }
    return {};
  } catch (err) {
    reject(err);
  }
};

/**
 * Get the JS URL
 *
 * @param {string} query
 * @returns {Promise<{url: string, path: string, vqd: string}>}
 */
async function getJS(query) {
  const html = await request(`https://duckduckgo.com/?q=${query}`);
  const url = html.match(
    /"(https:\/\/links\.duckduckgo\.com\/d\.js[^">]+)">/,
  )[1];
  return {
    url,
    path: url.match(/\/d\.js.*/)[0],
    vqd: url.match(/vqd=([^&]+)/)[1],
  };
}

/**
 * Parse the JS
 *
 * @param {string} path
 * @param {boolean} fetchAll
 * @returns {Promise<{results: {title: string, url: string, domain: string, description: string, icon: string}[], hasNext: boolean|undefined, next: string|undefined}>} The search results.
 */
async function regularSearch(path, fetchAll = false) {
  const js = await request(`https://links.duckduckgo.com${path}`);
  const result = js.match(/DDG\.pageLayout\.load\('d',? ?(\[.+\])?\);/);
  const data = result && result[1] ? JSON.parse(result[1]) : [];
  const next = data.find((d) => d.n);
  const parsed = data
    .filter((d) => !d.n)
    .map((item) => {
      return {
        title: item.t,
        url: item.u,
        domain: item.i,
        description: item.a,
        icon: `https://external-content.duckduckgo.com/ip3/${item.i}.ico`,
      };
    });

  if (fetchAll && next != null) {
    return {
      results: [...parsed, ...(await regularSearch(next.n, fetchAll)).results],
    };
  }

  return { hasNext: next != null, next: next?.n || undefined, results: parsed };
}
