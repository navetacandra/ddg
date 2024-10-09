declare const languages = {
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

type RegularResults = {
  title: string;
  url: string;
  domain: string;
  description: string;
  icon: string;
}[];

type ImageResults = {
  height: number;
  width: number;
  image: string;
  url: string;
  title: string;
}[];

type VideoResults = {
  url: string;
  title: string;
  description: string;
  duration: string;
  embed_url: string;
  published: string;
  publisher: string;
  images: {
    large: string;
    medium: string;
    motion: string;
    small: string;
  };
}[];

type NewsResults = {
  excerpt: string;
  relative_time: string;
  source: string;
  title: string;
  image?: string;
  url: string;
  date: number;
}[];

type MapResults = {
  id: string;
  name: string;
  address: string;
  city: string | null;
  address_lines: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country_code: string | null;
  category: string;
  phone: string;
  timezone: string;
}[];

type SearchQuery = {
  query: string;
  next?: string;
};

type LanguageKey = keyof typeof languages;
type Language = (typeof languages)[keyof typeof languages];

export type SearchType = "regular" | "image" | "video" | "news" | "map";
export declare function search(
  sq: SearchQuery,
  type?: SearchType,
  all?: boolean,
): Promise<{
  hasNext: boolean;
  next: string | number;
  results:
    | RegularResults
    | ImageResults
    | VideoResults
    | NewsResults
    | MapResults;
}>;

export declare function translate(
  text: string,
  from: string,
  to: string,
): Promise<{ detected_language: string | null; translated: string }>;
