const { request, getJS } = require("./utils");

/**
 *
 * @param {{query: string, next: string|undefined}} data
 * @param {'regular'|'image'|'video'|'news'|'map'} type
 * @param {boolean} all
 * @returns {Promise<{results: Array.<Object>, hasNext: boolean|undefined, next: string|number|undefined}>}
 */
exports.search = async (data, type = "regular", all = false) => {
  try {
    const apiURL =
      data.next && typeof data.next == "string"
        ? { path: data.next, vqd: new URLSearchParams(data.next).get(`vqd`) }
        : await getJS(data.query);

    if (!type || type == "regular") {
      return await regularSearch(apiURL.path, all);
    } else if (type == "image") {
      return await mediaSearch(
        data.query,
        apiURL.vqd,
        "i",
        "&p=1&image_exp=a&product_ad_extensions_exp=b",
        ({ height, width, image, url, title }) => ({
          height,
          width,
          image,
          url,
          title,
        }),
        all,
        data.next || 0,
      );
    } else if (type == "video") {
      return await mediaSearch(
        data.query,
        apiURL.vqd,
        "v",
        "&p=-1",
        ({
          content: url,
          title,
          description,
          duration,
          images,
          embed_url,
          published,
          publisher,
        }) => ({
          url,
          title,
          description,
          duration,
          images,
          embed_url,
          published,
          publisher,
        }),
        all,
        data.next || 0,
      );
    } else if (type == "news") {
      return await mediaSearch(
        data.query,
        apiURL.vqd,
        "news",
        "&p=-1&noamp=1",
        (item) => {
          const { excerpt, relative_time, source, title, url, date } = item;
          return {
            excerpt,
            relative_time,
            source,
            title,
            url,
            date: Number(`${date}`.padEnd(13, "0")),
          };
        },
        all,
        data.next || 0,
      );
    } else if (type == "map") {
      return await mediaSearch(
        data.query,
        apiURL.vqd,
        "local",
        "tg=maps_places&rt=D&mkexp=b&wiki_info=1&is_requery=1&latitude=0&longitude=0&location_type=geoip",
        ({
          id,
          name,
          address,
          city,
          address_lines,
          coordinates,
          country_code,
          ddg_category: category,
          display_phone: phone,
          timezone,
        }) => ({
          id,
          name,
          address,
          city,
          address_lines,
          coordinates,
          country_code,
          category,
          phone,
          timezone,
        }),
        all,
        data.next || 0,
      );
    }
  } catch (err) {
    throw err;
  }
};

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

  if (fetchAll && !!next) {
    return {
      results: [...parsed, ...(await regularSearch(next.n, fetchAll)).results],
    };
  }

  return fetchAll
    ? { results: parsed }
    : { hasNext: !!next, next: next?.n || undefined, results: parsed };
}

/**
 * Parse the JS
 *
 * @param {string} query
 * @param {string} vqnd
 * @param {string} prefix
 * @param {string} additional_param
 * @param {Function} parser
 * @param {boolean} fetchAll
 * @param {number} cursor
 * @returns {Promise<{results: {title: string, url: string, domain: string, description: string, icon: string}[], hasNext: boolean|undefined, next: number|undefined}>} The search results.
 */
async function mediaSearch(
  query,
  vqnd,
  prefix,
  additional_param,
  parser,
  fetchAll = false,
  cursor = 0,
) {
  const res = await request(
    `https://duckduckgo.com/${prefix}.js?q=${query}&o=json&p=1&s=${cursor}&u=bing&l=us-en&vqd=${vqnd}${additional_param}`,
  );
  const { results, next } = JSON.parse(res);
  const data = results.map(parser);
  if (fetchAll && !!next) {
    return {
      results: [
        ...data,
        ...(
          await mediaSearch(
            query,
            vqnd,
            prefix,
            additional_param,
            parser,
            fetchAll,
            cursor + data.length,
          )
        ).results,
      ],
    };
  }
  return fetchAll
    ? { results: data }
    : { results: data, hasNext: !!next, next: !!next ? cursor + data.length : undefined };
}
