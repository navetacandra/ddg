const { request, getJS } = require("./utils");

const baseURL = "https://duckduckgo.com/translation.js?query=translate";
exports.languages = {
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

/**
 *
 * @param {string} text
 * @param {string} from Empty string to auto-detect
 * @param {string} to
 *
 */
exports.translate = async (text = "", from = "", to = "en") => {
  if (from && !exports.languages[from])
    throw new Error(`${from} is not a valid language code`);
  if (!exports.languages[to])
    throw new Error(`${to} is not a valid language code`);

  const { vqd } = await getJS("translate");
  const res = await request(
    `${baseURL}&vqd=${vqd}${from ? `&from=${from}` : ""}&to=${to}`,
    {
      headers: { "Content-Type": "text/plain" },
      body: text,
      method: "POST",
    },
  );
  return JSON.parse(res);
};
