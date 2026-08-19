'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { LOCALES } from '@/lib/i18n';
import { useT } from './I18nProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100 transition-colors"
        aria-label="Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="uppercase text-xs font-semibold">{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-ink-100 shadow-card py-1.5 z-50">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-ink-50 transition-colors ${
                l.code === locale ? 'bg-brand-50 text-brand-800' : 'text-ink-700'
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="flex-1 text-left">{l.label}</span>
              {l.code === locale && <Check className="w-4 h-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
