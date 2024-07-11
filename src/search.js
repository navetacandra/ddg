const { request } = require("./utils");

/**
 *
 * @param {string} query
 * @param {'regular'|'image'|'video'|'news'|'map'} type
 * @param {boolean} all
 */
exports.search = async (query, type = "regular", all = "false") => {
  try {
    const apiURL = await getJS(query);

    if (!type || type == "regular") {
      return await regularSearch(apiURL.path, all);
    } else if (type == "image") {
      return await mediaSearch(
        query,
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
      );
    } else if (type == "video") {
      return await mediaSearch(
        query,
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
      );
    } else if (type == "news") {
      return await mediaSearch(
        query,
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
      );
    } else if (type == "map") {
      return await mediaSearch(
        query,
        apiURL.vqd,
        "local",
        "tg=maps_places&rt=D&mkexp=b&wiki_info=1&is_requery=1&latitude=0&longitude=0&location_type=geoip",
        ({
          id,
          name,
          address,
          city,
          address_lines,
          city,
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
          city,
          coordinates,
          country_code,
          category,
          phone,
          timezone,
        }),
        all,
      );
    }
  } catch (err) {
    throw err;
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

  if (fetchAll && !!next) {
    return {
      results: [...parsed, ...(await regularSearch(next.n, fetchAll)).results],
    };
  }

  return fetchAll
    ? { results: parsed }
    : { hasNext: !!next, next: next?.n || undefined, results: parsed };
}

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
    : { results: data, hasNext: !!next, nextCursor: cursor + data.length };
}
