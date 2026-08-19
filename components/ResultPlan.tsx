'use client';

import { useMemo, useState } from 'react';
import { buildPlan, totalSavings, type Answers } from '@/lib/recommendations';
import { ArrowRight, ArrowLeft, Sparkles, TrendingUp, Mail, Share2 } from 'lucide-react';
import { useT } from './I18nProvider';

type Props = {
  audience: 'particulier' | 'entrepreneur';
  answers: Answers;
  onRestart: () => void;
};

const effortColor = {
  facile: 'bg-emerald-100 text-emerald-800',
  moyen: 'bg-amber-100 text-amber-800',
  avance: 'bg-rose-100 text-rose-800',
};

export default function ResultPlan({ audience, answers, onRestart }: Props) {
  const plan = useMemo(() => buildPlan(audience, answers), [audience, answers]);
  const total = totalSavings(plan);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, formatEuro } = useT();

  async function send() {
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          audience,
          answers,
          planTotalSavings: total,
          source: 'diagnostic-result',
        }),
      });
    } catch (e) {
      // tolerate failures — v0.1
    }
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="badge bg-brand-100 text-brand-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          {t('home.mockup.title')}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t('plan.title').replace('{amount}', formatEuro(total)).replace('{period}', t('common.year').trim())}
        </h2>
        <p className="mt-2 text-ink-600">
          {t('plan.subtitle').replace('{n}', String(plan.length))}
        </p>
      </div>

      <div className="space-y-4">
        {plan.map((r, i) => (
          <div key={r.id} className="card hover:shadow-soft transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl shrink-0">
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-ink-500">
                    #{i + 1}
                  </span>
                  <span className={`badge ${effortColor[r.effort]}`}>
                    {t(`plan.effort.${r.effort}`)}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-brand-700 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    +{formatEuro(r.estimatedAnnualSavings)}{t('common.year')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{r.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed mb-3">
                  {r.description}
                </p>
                <a
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800"
                >
                  {r.action}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email capture */}
      <div className="card mt-8 bg-gradient-to-br from-brand-50 to-white border-brand-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{t('plan.email.title')}</h3>
            <p className="text-sm text-ink-600 mb-3">{t('plan.email.text')}</p>
            {sent ? (
              <div className="flex items-center gap-2 text-brand-700 font-medium text-sm">
                <Sparkles className="w-4 h-4" />
                {t('plan.email.sent')}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder={t('plan.email.placeholder')}
                  className="input flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? t('plan.email.sending') : t('plan.email.cta')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onRestart} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('plan.restart')}
        </button>
        {audience === 'particulier' && (
          <a href="/entrepreneur" className="text-sm text-ink-600 hover:text-ink-800">
            {t('plan.toPart')}
          </a>
        )}
        {audience === 'entrepreneur' && (
          <a href="/tarifs" className="text-sm text-brand-700 font-medium hover:underline">
            {t('plan.toPremium')}
          </a>
        )}
      </div>
    </div>
  );
}
