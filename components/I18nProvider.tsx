'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fr, type Dict } from '@/i18n/fr';
import { en } from '@/i18n/en';
import { es } from '@/i18n/es';
import { de } from '@/i18n/de';
import { it } from '@/i18n/it';
import { pt } from '@/i18n/pt';
import { nl } from '@/i18n/nl';
import { DEFAULT_LOCALE, LOCALES, type Locale, getNumberFormatter } from '@/lib/i18n';

const dictionaries: Record<Locale, Dict> = { fr, en, es, de, it, pt, nl };

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  formatEuro: (amount: number) => string;
  formatNumber: (amount: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'em_locale';

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    return k in vars ? String(vars[k]) : `{${k}}`;
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (LOCALES.map((l) => l.code) as string[]).includes(saved)) {
        setLocaleState(saved as Locale);
      }
    } catch {}
    setReady(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const dict = dictionaries[locale] ?? fr;
  // Fallback: if a key is missing in current locale, use FR
  const frDict = fr;

  const t: I18nContextValue['t'] = (key, vars) => {
    const value = (dict as any)[key] ?? (frDict as any)[key] ?? key;
    return interpolate(value, vars);
  };

  const formatEuro = (amount: number) => {
    try {
      return getNumberFormatter(locale).format(amount);
    } catch {
      return `${amount.toLocaleString()} €`;
    }
  };

  const formatNumber = (amount: number) => {
    const map: Record<Locale, string> = {
      fr: 'fr-FR', en: 'en-GB', es: 'es-ES', de: 'de-DE', it: 'it-IT', pt: 'pt-PT', nl: 'nl-NL',
    };
    try {
      return new Intl.NumberFormat(map[locale]).format(amount);
    } catch {
      return String(amount);
    }
  };

  // Don't block render — server renders FR, client re-renders with chosen locale
  if (!ready) {
    return (
      <I18nContext.Provider
        value={{
          locale: DEFAULT_LOCALE,
          setLocale,
          t: (key, vars) => interpolate((fr as any)[key] ?? key, vars),
          formatEuro: (n) => `${n.toLocaleString('fr-FR')} €`,
          formatNumber: (n) => n.toLocaleString('fr-FR'),
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatEuro, formatNumber }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider (shouldn't happen)
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (k: string) => k,
      formatEuro: (n: number) => `${n} €`,
      formatNumber: (n: number) => String(n),
    } as I18nContextValue;
  }
  return ctx;
}
