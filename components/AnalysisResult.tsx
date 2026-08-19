'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Mail,
  Crown,
} from 'lucide-react';
import type { AnalysisOutput } from '@/lib/llm';
import { useT } from './I18nProvider';

type Props = {
  result: AnalysisOutput;
  previewUrl?: string;
  onRestart: () => void;
};

const effortLabel = { facile: 'Facile', moyen: 'Moyen', avance: 'Avancé' };
const effortColor = {
  facile: 'bg-emerald-100 text-emerald-800',
  moyen: 'bg-amber-100 text-amber-800',
  avance: 'bg-rose-100 text-rose-800',
};

const categoryEmoji: Record<string, string> = {
  logement: '🏠',
  transport: '🚗',
  courses: '🛒',
  abonnements: '📺',
  energie: '⚡',
  restaurant: '🍽️',
  loisirs: '🎭',
  banque: '🏦',
  assurance: '🛡️',
  sante: '🩺',
  autre: '💼',
};

export default function AnalysisResult({ result, previewUrl, onRestart }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, formatEuro } = useT();

  async function subscribe() {
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          audience: 'particulier',
          source: 'analyse-ia',
          planTotalSavings: result.totalEstimatedSavings,
        }),
      });
    } catch {}
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero result */}
      <div className="card bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold text-brand-100">{t('result.iaBadge')}</span>
        </div>
        <p className="text-2xl md:text-3xl font-bold leading-snug mb-3">
          {result.summary}
        </p>
        <div className="flex items-end gap-6 mt-5">
          <div>
            <p className="text-sm text-brand-100">{t('result.savingsLabel')}</p>
            <p className="text-5xl font-bold mt-1">{formatEuro(result.totalEstimatedSavings)}</p>
          </div>
          <div className="text-brand-100 text-sm pb-2">
            <p>{result.recommendations.length} {t('result.actions')}</p>
            <p>{result.recurring.length} {t('result.subs')}</p>
          </div>
        </div>
      </div>

      {/* Recurring detected */}
      {result.recurring.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔁</span> {t('result.subsTitle')}
            <span className="ml-auto text-sm font-normal text-ink-500">
              {t('result.subsTotal')} {result.recurring.reduce((s, r) => s + r.monthlyAmount, 0).toFixed(2)} €{t('common.month')}
            </span>
          </h3>
          <ul className="divide-y divide-ink-100">
            {result.recurring.map((r, i) => (
              <li key={i} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-500">{r.note}</p>
                </div>
                <span className="font-semibold text-ink-800 whitespace-nowrap">
                  {r.monthlyAmount.toFixed(2)} €<span className="text-xs text-ink-500">/mois</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Unusual fees */}
      {result.unusualFees.length > 0 && (
        <div className="card border-amber-200 bg-amber-50">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>⚠️</span> {t('result.unusual')}
          </h3>
          <ul className="space-y-3">
            {result.unusualFees.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-amber-700 font-semibold whitespace-nowrap">
                  {f.amount.toFixed(2)} €
                </span>
                <div>
                  <p className="font-medium text-ink-900">{f.label}</p>
                  <p className="text-sm text-ink-600">{f.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            {t('result.recsTitle').replace('{n}', String(result.recommendations.length))}
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((r, i) => (
              <div key={i} className="card hover:shadow-soft transition-shadow">
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
                        {effortLabel[r.effort]}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-brand-700 font-bold">
                        +{formatEuro(r.estimatedAnnualSavings)}{t('common.year')}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">{r.title}</h4>
                    <p className="text-ink-600 text-sm leading-relaxed mb-3">
                      {r.description}
                    </p>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
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
        </div>
      )}

      {/* Transactions table (collapsed) */}
      {result.transactions.length > 0 && (
        <details className="card">
          <summary className="cursor-pointer font-semibold flex items-center gap-2">
            📋 {t('result.transactions')} ({result.transactions.length})
            <span className="text-xs font-normal text-ink-500 ml-2">
              {t('result.transactionsHint')}
            </span>
          </summary>
          <ul className="mt-4 divide-y divide-ink-100 max-h-96 overflow-y-auto">
            {result.transactions.map((t, i) => (
              <li key={i} className="py-2 flex items-center gap-3 text-sm">
                <span className="text-base">{categoryEmoji[t.category] ?? '•'}</span>
                <span className="flex-1 min-w-0 truncate text-ink-800">{t.label}</span>
                <span className="text-xs text-ink-500 whitespace-nowrap">{t.date}</span>
                <span
                  className={
                    'font-mono font-semibold whitespace-nowrap ' +
                    (t.amount < 0 ? 'text-ink-800' : 'text-emerald-700')
                  }
                >
                  {t.amount < 0 ? '−' : '+'}
                  {Math.abs(t.amount).toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Upgrade nudge */}
      <div className="card bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{t('result.upgrade.title')}</h3>
            <p className="text-sm text-ink-600 mb-3">{t('result.upgrade.text')}</p>
            <a href="/tarifs" className="btn-primary text-sm">
              {t('result.upgrade.cta')}
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Email capture */}
      <div className="card bg-gradient-to-br from-brand-50 to-white border-brand-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{t('result.email.title')}</h3>
            <p className="text-sm text-ink-600 mb-3">{t('result.email.subtitle')}</p>
            {sent ? (
              <div className="flex items-center gap-2 text-brand-700 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {t('result.email.sent')}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  subscribe();
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder={t('result.email.placeholder')}
                  className="input flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? t('result.email.sending') : t('result.email.cta')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <button onClick={onRestart} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('result.restart')}
        </button>
        <a href="/" className="text-ink-500 hover:text-ink-800">
          {t('result.backHome')}
        </a>
      </div>
    </div>
  );
}
