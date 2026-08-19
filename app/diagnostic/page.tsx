'use client';

import Link from 'next/link';
import { ArrowRight, Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import DiagnosticClient from '@/components/DiagnosticClient';
import { useT } from '@/components/I18nProvider';

export default function DiagnosticParticulierPage() {
  const { t } = useT();
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-10 md:py-14 text-center">
          <span className="badge bg-white border border-brand-200 text-brand-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('diag.part.badge')}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">{t('diag.part.title')}</h1>
          <p className="mt-3 text-ink-600 max-w-xl mx-auto">{t('diag.part.subtitle')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-ink-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t('diag.part.time')}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {t('diag.part.anon')}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {t('diag.part.noEngage')}</span>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <DiagnosticClient audience="particulier" />
      </section>

      <section className="container-page pb-20 text-center text-sm text-ink-500">
        <p>
          {t('diag.part.toEntrepreneur')}{' '}
          <Link href="/entrepreneur" className="text-brand-700 font-medium hover:underline">
            {t('diag.part.toEntrepreneur.cta')} <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </p>
      </section>
    </>
  );
}
