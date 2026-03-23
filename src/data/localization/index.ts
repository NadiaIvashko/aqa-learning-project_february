import { LanguageData } from './types';
import { english } from './en';
import { spanish } from './es';
import { japanese } from './ja';

export { LanguageData, HeaderTranslations, FooterTranslations } from './types';

export const SUPPORTED_LANGUAGES: LanguageData[] = [english, spanish, japanese];

export function getLanguageByCode(code: string): LanguageData {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  if (!lang) {
    throw new Error(`Language with code "${code}" is not supported`);
  }
  return lang;
}
