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
        !!data.next ? data.next : `/i.js?q=${encodeURIComponent(data.query)}&o=json&s=0&u=bing&l=us-en&vqd=${apiURL.vqd}&p=-1&image_exp=a&product_ad_extensions_exp=b`,
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
        !!data.next ? data.next : `/v.js?q=${encodeURIComponent(data.query)}&o=json&s=0&u=bing&l=us-en&vqd=${apiURL.vqd}&p=-1`,
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
        !!data.next ? data.next : `/news.js?q=${encodeURIComponent(data.query)}&o=json&s=0&u=bing&l=us-en&vqd=${apiURL.vqd}&p=-1&noamp=1`,
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
        !!data.next ? data.next : `/local.js?q=${encodeURIComponent(data.query)}&o=json&s=0&u=bing&l=us-en&vqd=${apiURL.vqd}&tg=maps_places&rt=D&mkexp=b&wiki_info=1&is_requery=1&latitude=0&longitude=0&location_type=geoip`,
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
  let data;
  if (result && result[1]) {
    try {
      data = JSON.parse(result[1]);
    } catch (err) {
      throw new Error(`Failed parsing from DDG response.`);
    }
  } else {
    data = [];
  }
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
 * @param {string} path
 * @param {Function} parser
 * @param {boolean} fetchAll
 * @returns {Promise<{results: {title: string, url: string, domain: string, description: string, icon: string}[], hasNext: boolean|undefined, next: number|undefined}>} The search results.
 */
async function mediaSearch(path, parser, fetchAll=false) {
  const url = new URL(`https://duckduckgo.com${path}`);
  try {
    const res = await request(url.href);
    let results, next;
    
    try {
      const _parsed = JSON.parse(res);
      const nextCursor = new URLSearchParams(_parsed.next).get('s');
      const nextVqd = _parsed.vqd[_parsed.queryEncoded];
      results = _parsed.results;
      url.searchParams.set('s', nextCursor);
      url.searchParams.set('vqd', nextVqd);
      next = `${url.pathname}?${url.searchParams.toString()}`;
      console.log(next)
    } catch(err) {
      throw new Error(`Failed parsing from DDG response https://duckduckgo.com${path}`);
    }

    const data = results.map(parser);
    if (fetchAll && !!next) {
      return {
        results: [
          ...data,
          ...(
            await mediaSearch(`/${next}`, parser, fetchAll)
          ).results,
        ],
      };
    }

    return fetchAll
      ? { results: data }
      : {
          results: data,
          hasNext: !!next,
          next: !!next ? next : undefined,
        };
  } catch(err) {
    throw err;
  }
}
