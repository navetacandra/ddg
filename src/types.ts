export type VqdMetadata = {
  path: string;
  vqd: string;
};

export type SearchQuery = {
  query: string;
  next?: string;
};

export type SearchCategory = "web" | "image" | "video" | "news" | "map";

export type ResultParser<T> = (data: any) => T;

export type WebResult = {
  title: string;
  url: string;
  domain: string;
  description: string;
  icon: string;
};

export type ImageResult = {
  title: string;
  url: string;
  imageUrl: string;
  width: number;
  height: number;
};

export type VideoResult = {
  url: string;
  title: string;
  description: string;
  duration: string;
  embedUrl: string;
  publishedAt: string;
  publisher: string;
  thumbnails: {
    large: string;
    medium: string;
    motion: string;
    small: string;
  };
};

export type NewsResult = {
  title: string;
  excerpt: string;
  url: string;
  source: string;
  date: number;
  relativeTime: string;
  imageUrl?: string;
};

export type MapResult = {
  id: string;
  name: string;
  address: string;
  addressLines: string[];
  city: string | null;
  countryCode: string | null;
  category: string;
  phone: string;
  timezone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

export type SearchResponse<T> = {
  data: T[];
  next: string | null;
  hasNext: boolean;
};

export const languages = {
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
} as const;

export type LanguageCode = keyof typeof languages;
export type LanguageName = (typeof languages)[LanguageCode];
export type TranslateResponse = {
  detected_language: LanguageCode | null;
  text: string;
};
