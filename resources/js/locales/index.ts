import en from './en';
import es from './es';
import fr from './fr';

export const locales = {
    EN: en,
    FR: fr,
    ES: es,
} as const;

export type LocaleCode = keyof typeof locales;
export type LocaleContent = (typeof locales)[LocaleCode];
