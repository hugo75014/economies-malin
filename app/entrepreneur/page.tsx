'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Sparkles, Clock, ShieldCheck, Briefcase, TrendingUp } from 'lucide-react';
import DiagnosticClient from '@/components/DiagnosticClient';
import { useT } from '@/components/I18nProvider';

export default function EntrepreneurPage() {
  const { t } = useT();
  return (
    <>
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <div className="container-page py-10 md:py-14 text-center">
          <span className="badge bg-white border border-amber-200 text-amber-800 mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            {t('diag.ent.badge')}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">{t('diag.ent.title')}</h1>
          <p className="mt-3 text-ink-600 max-w-xl mx-auto">{t('diag.ent.subtitle')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-ink-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t('diag.ent.time')}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {t('diag.ent.anon')}</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {t('diag.ent.upTo')}</span>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <DiagnosticClient audience="entrepreneur" />
      </section>

      <section className="container-page pb-20 text-center text-sm text-ink-500">
        <p>
          {t('diag.ent.toPart')}{' '}
          <Link href="/diagnostic" className="text-amber-700 font-medium hover:underline">
            {t('diag.ent.toPart.cta')} <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </p>
      </section>
    </>
  );
}
