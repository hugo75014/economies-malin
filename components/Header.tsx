'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, PiggyBank } from 'lucide-react';
import clsx from 'clsx';
import LanguageSwitcher from './LanguageSwitcher';
import { useT } from './I18nProvider';

const links = [
  { href: '/', key: 'nav.home' },
  { href: '/analyse', key: 'nav.analyse', highlight: true },
  { href: '/diagnostic', key: 'nav.diagnostic' },
  { href: '/entrepreneur', key: 'nav.entrepreneur' },
  { href: '/ressources', key: 'nav.ressources' },
  { href: '/tarifs', key: 'nav.tarifs' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-100">
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink-900">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-brand-600 text-white">
            <PiggyBank className="w-5 h-5" />
          </span>
          <span>Économies Malin</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
                pathname === l.href
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-ink-700 hover:text-ink-900 hover:bg-ink-50',
                (l as any).highlight && 'ring-1 ring-amber-300 bg-amber-50/60 text-amber-800 hover:bg-amber-50',
              )}
            >
              {(l as any).highlight && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/analyse" className="btn-secondary text-sm py-2 px-3 hidden lg:inline-flex">
            {t('header.cta.analyse')}
          </Link>
          <Link href="/diagnostic" className="btn-primary text-sm py-2 px-4">
            {t('header.cta.diagnostic')}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-ink-100"
            aria-label={t('header.menu')}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white">
          <div className="container-page py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium',
                  pathname === l.href
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-ink-700 hover:bg-ink-50',
                )}
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              href="/diagnostic"
              onClick={() => setOpen(false)}
              className="btn-primary text-sm py-2 mt-2"
            >
              {t('header.cta.diagnostic')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
