// i18n infrastructure — locale + translation dictionary + hook
// 7 languages: FR (default), EN, ES, DE, IT, PT, NL

export type Locale = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'nl';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export const DEFAULT_LOCALE: Locale = 'fr';

export type Dictionary = Record<string, string>;

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES.map((l) => l.code) as string[]).includes(value);
}

export function getNumberFormatter(locale: Locale) {
  // Map our locales to BCP-47 tags
  const map: Record<Locale, string> = {
    fr: 'fr-FR',
    en: 'en-GB',
    es: 'es-ES',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    nl: 'nl-NL',
  };
  return new Intl.NumberFormat(map[locale], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}
