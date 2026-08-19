'use client';

import Link from 'next/link';
import {
  PiggyBank,
  Sparkles,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Building2,
  User,
  Zap,
  Banknote,
  Receipt,
  HeartPulse,
  Briefcase,
  Upload,
} from 'lucide-react';
import { useT } from '@/components/I18nProvider';

export default function HomePage() {
  const { t } = useT();
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge bg-white border border-brand-200 text-brand-700 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('home.hero.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              {t('home.hero.title.1')}{' '}
              <span className="text-brand-600">{t('home.hero.title.2')}</span>{' '}
              {t('home.hero.title.3')}
            </h1>
            <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/analyse" className="btn-primary">
                <Upload className="w-4 h-4 mr-2" />
                {t('home.hero.cta.primary')}
              </Link>
              <Link href="/diagnostic" className="btn-secondary">
                {t('home.hero.cta.secondary')}
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              {t('home.hero.trust')}
            </p>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="card shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t('home.mockup.title')}</p>
                    <p className="text-xs text-ink-500">{t('home.mockup.subtitle')}</p>
                  </div>
                </div>
                <span className="badge bg-brand-50 text-brand-700">{t('home.ways.part.title')}</span>
              </div>

              <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl p-4 border border-brand-100">
                <p className="text-xs text-ink-500 mb-1">{t('home.mockup.savings')}</p>
                <p className="text-4xl font-bold text-brand-700">1 870 €</p>
                <div className="mt-2 h-2 bg-brand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                {[
                  { e: '⚡', k: 'home.mockup.example1', s: '+320 €/an' },
                  { e: '🏦', k: 'home.mockup.example2', s: '+180 €/an' },
                  { e: '📺', k: 'home.mockup.example3', s: '+280 €/an' },
                ].map((it) => (
                  <li key={it.k} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{it.e}</span>
                      <span className="text-ink-800">{t(it.k)}</span>
                    </span>
                    <span className="font-semibold text-brand-700">{it.s}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink-500 mt-3">{t('home.mockup.more')}</p>
            </div>

            <div className="absolute -top-4 -right-4 bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full px-3 py-1.5 shadow-soft">
              {t('home.mockup.badge')}
            </div>
          </div>
        </div>
      </section>

      {/* 3 WAYS */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t('home.ways.title')}</h2>
          <p className="mt-3 text-ink-600">{t('home.ways.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* IA — featured */}
          <Link href="/analyse" className="card group relative hover:border-brand-400 hover:shadow-soft transition-all border-2 border-brand-300">
            <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              ⚡ {t('common.badge.new')}
            </div>
            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{t('home.ways.ia.title')}</h3>
            </div>
            <p className="text-ink-600 mb-4">{t('home.ways.ia.desc')}</p>
            <ul className="space-y-2 text-sm text-ink-700">
              {[t('home.ways.ia.feat1'), t('home.ways.ia.feat2'), t('home.ways.ia.feat3')].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 inline-flex items-center text-brand-700 font-medium group-hover:gap-2 transition-all">
              {t('common.cta.primary')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/diagnostic" className="card group hover:border-brand-300 hover:shadow-soft transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                <User className="w-6 h-6 text-brand-700" />
              </div>
              <h3 className="text-2xl font-bold">{t('home.ways.part.title')}</h3>
            </div>
            <p className="text-ink-600 mb-4">{t('home.ways.part.desc')}</p>
            <ul className="space-y-2 text-sm text-ink-700">
              {[t('home.ways.part.feat1'), t('home.ways.part.feat2'), t('home.ways.part.feat3')].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 inline-flex items-center text-brand-700 font-medium group-hover:gap-2 transition-all">
              {t('common.start')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/entrepreneur" className="card group hover:border-amber-300 hover:shadow-soft transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold">{t('home.ways.ent.title')}</h3>
            </div>
            <p className="text-ink-600 mb-4">{t('home.ways.ent.desc')}</p>
            <ul className="space-y-2 text-sm text-ink-700">
              {[t('home.ways.ent.feat1'), t('home.ways.ent.feat2'), t('home.ways.ent.feat3')].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 inline-flex items-center text-amber-700 font-medium group-hover:gap-2 transition-all">
              {t('common.start')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-ink-50">
        <div className="container-page py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t('home.how.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" />, k1: 'home.how.step1.title', k2: 'home.how.step1.text' },
              { icon: <TrendingUp className="w-6 h-6" />, k1: 'home.how.step2.title', k2: 'home.how.step2.text' },
              { icon: <Sparkles className="w-6 h-6" />, k1: 'home.how.step3.title', k2: 'home.how.step3.text' },
            ].map((s, i) => (
              <div key={i} className="card">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{t(s.k1)}</h3>
                <p className="text-ink-600">{t(s.k2)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t('home.cats.title')}</h2>
          <p className="mt-3 text-ink-600">{t('home.cats.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { i: <Zap className="w-5 h-5" />, k: 'home.cats.energie' },
            { i: <Banknote className="w-5 h-5" />, k: 'home.cats.banque' },
            { i: <Receipt className="w-5 h-5" />, k: 'home.cats.abos' },
            { i: <ShieldCheck className="w-5 h-5" />, k: 'home.cats.assurance' },
            { i: <HeartPulse className="w-5 h-5" />, k: 'home.cats.mutuelle' },
            { i: <Briefcase className="w-5 h-5" />, k: 'home.cats.compta' },
          ].map((c) => (
            <div key={c.k} className="card text-center py-5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-2">
                {c.i}
              </div>
              <p className="text-sm font-medium text-ink-800">{t(c.k)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-brand-600 text-white">
        <div className="container-page py-16 grid md:grid-cols-3 gap-8 text-center">
          {[
            { v: t('home.proof.v1'), l: t('home.proof.l1') },
            { v: t('home.proof.v2'), l: t('home.proof.l2') },
            { v: t('home.proof.v3'), l: t('home.proof.l3') },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-4xl md:text-5xl font-bold">{s.v}</p>
              <p className="mt-1 text-brand-100">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">{t('home.cta.title')}</h2>
        <p className="mt-3 text-ink-600 max-w-xl mx-auto">{t('home.cta.subtitle')}</p>
        <Link href="/diagnostic" className="btn-primary mt-6">
          {t('home.cta.button')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </section>
    </>
  );
}
