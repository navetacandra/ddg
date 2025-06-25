import {
  LanguageCode,
  LanguageName,
  languages,
  TranslateResponse,
} from "./types";
import { getJS, request } from "./utils";

const baseURL: string = "https://duckduckgo.com/translation.js?query=translate";

const languageCodes = Object.keys(languages);
const languageNames = Object.values(languages);
const languageCollection = [...languageCodes].concat(languageNames);

export { languages };
export async function translate(
  text: string,
  from: LanguageCode | LanguageName | "",
  to: LanguageCode | LanguageName,
): Promise<TranslateResponse> {
  if (!(from === "" || languageCollection.some((lang) => lang === from)))
    throw new Error("Invalid from!");
  if (!languageCollection.some((lang) => lang === to))
    throw new Error("Invalid to!");

  if (languageNames.some((lang) => lang === from))
    from = languageCodes.find(
      (lang) => languages[lang as LanguageCode] === from,
    ) as LanguageCode;
  if (languageNames.some((lang) => lang === to))
    to = languageCodes.find(
      (lang) => languages[lang as LanguageCode] === to,
    ) as LanguageCode;

  const { vqd } = await getJS("translate");
  return await (
    await request(
      `${baseURL}&vqd=${vqd}${from ? `&from=${from}` : ""}&to=${to}`,
      {
        headers: { "Content-Type": "text/plain" },
        body: text,
        method: "POST",
      },
    )
  ).json();
}
