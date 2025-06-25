const languages = {
    en: "English",
    af: "Afrikaans",
    sq: "Albanian",
    am: "Amharic",
    ar: "Arabic",
    hy: "Armenian",
    as: "Assamese",
    az: "Azerbaijani",
    bn: "Bangla",
    eu: "Basque",
    bs: "Bosnian",
    bg: "Bulgarian",
    yue: "Cantonese (Traditional)",
    ca: "Catalan",
    "zh-Hans": "Chinese Simplified",
    "zh-Hant": "Chinese Traditional",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    prs: "Dari",
    nl: "Dutch",
    et: "Estonian",
    fj: "Fijian",
    fil: "Filipino",
    fi: "Finnish",
    fr: "French",
    "fr-CA": "French (Canada)",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ht: "Haitian Creole",
    he: "Hebrew",
    hi: "Hindi",
    mww: "Hmong Daw",
    hu: "Hungarian",
    is: "Icelandic",
    id: "Indonesian",
    iu: "Inuktitut",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    kn: "Kannada",
    kk: "Kazakh",
    km: "Khmer",
    "tlh-Latn": "Klingon",
    ko: "Korean",
    ku: "Kurdish (Central)",
    kmr: "Kurdish (Northern)",
    lo: "Lao",
    lv: "Latvian",
    lt: "Lithuanian",
    mg: "Malagasy",
    ms: "Malay",
    ml: "Malayalam",
    mt: "Maltese",
    mi: "Maori",
    mr: "Marathi",
    my: "Myanmar (Burmese)",
    ne: "Nepali",
    nb: "Norwegian",
    or: "Odia",
    ps: "Pashto",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese (Brazil)",
    "pt-PT": "Portuguese (Portugal)",
    pa: "Punjabi",
    otq: "Querétaro Otomi",
    ro: "Romanian",
    ru: "Russian",
    sm: "Samoan",
    "sr-Cyrl": "Serbian (Cyrillic)",
    "sr-Latn": "Serbian (Latin)",
    sk: "Slovak",
    sl: "Slovenian",
    es: "Spanish",
    sw: "Swahili",
    sv: "Swedish",
    ty: "Tahitian",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    ti: "Tigrinya",
    to: "Tongan",
    tr: "Turkish",
    uk: "Ukrainian",
    ur: "Urdu",
    vi: "Vietnamese",
    cy: "Welsh",
    yua: "Yucatec Maya",
};

const randomIPv4 = () => Array.from({ length: 4 })
    .map((_) => Math.floor(Math.random() * 255))
    .join(".");
const randomIPv6Segment = () => Math.random().toString(16).slice(2, 6).padStart(4, "0");
const randomIPv6 = () => Array.from({ length: 8 })
    .map((_) => randomIPv6Segment())
    .join(":");
const userAgents = [
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11.0; Surface Duo) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
];
const request = async (url, options) => await fetch(url, {
    ...options,
    headers: {
        accept: "text/html; charset=utf-8",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "user-agent": userAgents[Math.floor(Math.random() * userAgents.length)],
        ...options?.headers,
        "x-forwarded-for": `${randomIPv4()}, ${randomIPv6()}`,
    },
});
const getJS = async (query) => {
    const html = await (await request(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`)).text();
    const regex = /"(https:\/\/links\.duckduckgo\.com\/d\.js[^">]+)">/;
    const url = html.match(regex)[1];
    return {
        path: url.match(/\/d\.js.*/)[0],
        vqd: url.match(/vqd=([^&]+)/)[1],
    };
};

const baseURL = "https://duckduckgo.com/translation.js?query=translate";
const languageCodes = Object.keys(languages);
const languageNames = Object.values(languages);
const languageCollection = [...languageCodes].concat(languageNames);
async function translate(text, from, to) {
    if (!(from === "" || languageCollection.some((lang) => lang === from)))
        throw new Error("Invalid from!");
    if (!languageCollection.some((lang) => lang === to))
        throw new Error("Invalid to!");
    if (languageNames.some((lang) => lang === from))
        from = languageCodes.find((lang) => languages[lang] === from);
    if (languageNames.some((lang) => lang === to))
        to = languageCodes.find((lang) => languages[lang] === to);
    const { vqd } = await getJS("translate");
    return await (await request(`${baseURL}&vqd=${vqd}${from ? `&from=${from}` : ""}&to=${to}`, {
        headers: { "Content-Type": "text/plain" },
        body: text,
        method: "POST",
    })).json();
}

async function media(requestData, parser, all = false) {
    const url = new URL(`https://duckduckgo.com${requestData.path}`);
    const res = await (await request(url.href)).text();
    const result = { data: [], next: null, hasNext: false };
    if (res === "If this error persists, please let us know: ops@duckduckgo.com")
        throw new Error("You got rate limit message.");
    const _parsed = JSON.parse(res);
    if (!("results" in _parsed))
        return result; // no results
    const nextCursor = new URLSearchParams(_parsed.next).get("s");
    const nextVqd = _parsed.vqd[_parsed.queryEncoded];
    url.searchParams.set("s", nextCursor || "");
    url.searchParams.set("vqd", nextVqd || "");
    result.hasNext = !!nextCursor;
    if (result.hasNext)
        requestData.path =
            result.next = `${url.pathname}?${url.searchParams.toString()}`;
    const results = _parsed.results;
    result.data = results.map((data) => parser(data));
    if (result.next && all) {
        const nextResult = await media(requestData, parser, all);
        result.data = [...result.data, ...nextResult.data];
        result.next = null;
        result.hasNext = false;
    }
    return result;
}

async function web(requestData, all = false) {
    const res = await (await request(`https://links.duckduckgo.com${requestData.path}`)).text();
    const result = {
        data: [],
        next: null,
        hasNext: false,
    };
    if (res === "If this error persists, please let us know: ops@duckduckgo.com")
        throw new Error("You got rate limit message.");
    const match = res.match(/DDG\.pageLayout\.load\('d',? ?(\[.+\])?\);/);
    if (!match || !match[1])
        return result;
    const ddgData = match[1];
    if (ddgData) {
        const parsed = JSON.parse(ddgData);
        result.data = parsed
            .filter((d) => !d.n)
            .map((item) => ({
            title: item.t,
            url: item.u,
            domain: item.i,
            description: item.a,
            icon: `https://external-content.duckduckgo.com/ip3/${item.i}.ico`,
        }));
        result.next = parsed.find((d) => d.n)?.n || null;
        result.hasNext = !!result.next;
    }
    if (result.next && all) {
        const nextResult = await web({ path: result.next }, all);
        result.data = [...result.data, ...nextResult.data];
        result.next = null;
        result.hasNext = false;
    }
    return result;
}

async function search(request, type = "web", all = false) {
    const searchRequest = request.next
        ? {
            path: request.next,
            vqd: new URLSearchParams(request.next).get("vqd") || "",
        }
        : await getJS(request.query);
    if (!searchRequest.vqd)
        throw new Error("Invalid VQD");
    if (type === "web")
        return web(searchRequest, all);
    else {
        let parser = (data) => data;
        if (type === "image") {
            searchRequest.path = `/i.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1&image_exp=a&product_ad_extensions_exp=b`;
            parser = ({ width, height, url, title, image: imageUrl, }) => ({ width, height, url, title, imageUrl });
        }
        else if (type === "video") {
            searchRequest.path = `/v.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1`;
            parser = ({ content: url, title, description, duration, images: thumbnails, embed_url: embedUrl, published: publishedAt, publisher, }) => ({
                url,
                title,
                description,
                duration,
                thumbnails,
                embedUrl,
                publishedAt,
                publisher,
            });
        }
        else if (type === "news") {
            searchRequest.path = `/news.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&p=-1&noamp=1`;
            parser = ({ image: imageUrl, excerpt, relative_time: relativeTime, source, title, url, date, }) => ({
                excerpt,
                relativeTime,
                source,
                title,
                url,
                date: Number(`${date}`.padEnd(13, "0")),
                ...(imageUrl ? { imageUrl } : {}),
            });
        }
        else if (type === "map") {
            searchRequest.path = `/local.js?q=${encodeURIComponent(request.query)}&o=json&s=0&u=bing&l=us-en&vqd=${searchRequest.vqd}&tg=maps_places&rt=D&mkexp=b&wiki_info=1&is_requery=1&latitude=0&longitude=0&location_type=geoip`;
            parser = ({ id, name, address, city, address_lines: addressLines, coordinates, country_code: countryCode, ddg_category: category, display_phone: phone, timezone, }) => ({
                id,
                name,
                address,
                city,
                addressLines,
                coordinates,
                countryCode,
                category,
                phone,
                timezone,
            });
        }
        return media(searchRequest, parser, all);
    }
}

export { languages, search, translate };
