'use client';

import Link from 'next/link';
import { PiggyBank, Mail, Twitter, Linkedin } from 'lucide-react';
import { useT } from './I18nProvider';

export default function Footer() {
  const { t } = useT();

  return (
    <footer className="bg-ink-900 text-ink-200 mt-20">
      <div className="container-page py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-white mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-brand-600 text-white">
              <PiggyBank className="w-5 h-5" />
            </span>
            <span>Économies Malin</span>
          </div>
          <p className="text-sm text-ink-300 leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.product')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/diagnostic" className="hover:text-white">{t('nav.diagnostic')}</Link></li>
            <li><Link href="/entrepreneur" className="hover:text-white">{t('nav.entrepreneur')}</Link></li>
            <li><Link href="/tarifs" className="hover:text-white">{t('nav.tarifs')}</Link></li>
            <li><Link href="/ressources" className="hover:text-white">{t('nav.ressources')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.legal')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/mentions-legales" className="hover:text-white">{t('footer.legal.mentions')}</Link></li>
            <li><Link href="/cgu" className="hover:text-white">{t('footer.legal.cgu')}</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">{t('footer.legal.privacy')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">{t('footer.contact')}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@economies-malin.fr" className="hover:text-white">
                hello@economies-malin.fr
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              <a href="#" className="hover:text-white">@economiesmalin</a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              <a href="#" className="hover:text-white">Économies Malin</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-ink-400">
          <p>© {new Date().getFullYear()} Économies Malin. {t('footer.copyright')}</p>
          <p>{t('footer.made')}</p>
        </div>
      </div>
    </footer>
  );
}
