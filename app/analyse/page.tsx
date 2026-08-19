'use client';

import AnalyseClient from '@/components/AnalyseClient';
import { Sparkles, ShieldCheck, Clock, Eye } from 'lucide-react';
import { useT } from '@/components/I18nProvider';

export default function AnalysePage() {
  const { t } = useT();
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-10 md:py-14 text-center">
          <span className="badge bg-white border border-brand-200 text-brand-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t('analyse.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t('analyse.title.1')}
            <br />
            <span className="text-brand-600">{t('analyse.title.2')}</span>
          </h1>
          <p className="mt-4 text-ink-600 max-w-xl mx-auto">{t('analyse.subtitle')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-ink-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t('analyse.trust.1')}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> {t('analyse.trust.2')}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {t('analyse.trust.3')}</span>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <AnalyseClient />
      </section>
    </>
  );
}
