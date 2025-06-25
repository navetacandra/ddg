import { LanguageCode, LanguageName, languages, TranslateResponse } from "./types";
export { languages };
export declare function translate(text: string, from: LanguageCode | LanguageName | "", to: LanguageCode | LanguageName): Promise<TranslateResponse>;
