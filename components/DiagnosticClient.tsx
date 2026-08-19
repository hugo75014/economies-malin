'use client';

import { useMemo, useState } from 'react';
import { getQuestionsFor, buildPlan, totalSavings, type Answers } from '@/lib/recommendations';
import ResultPlan from './ResultPlan';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useT } from './I18nProvider';

type Props = {
  audience: 'particulier' | 'entrepreneur';
};

export default function DiagnosticClient({ audience }: Props) {
  const questions = useMemo(() => getQuestionsFor(audience), [audience]);
  const [step, setStep] = useState(0); // 0..questions.length-1
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const router = useRouter();
  const { t } = useT();

  const totalSteps = questions.length;
  const progress = done ? 100 : Math.round((step / totalSteps) * 100);
  const currentQ = questions[step];
  const selected = answers[currentQ?.id];

  function choose(value: string) {
    setAnswers((a) => ({ ...a, [currentQ.id]: value }));
  }

  function next() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function prev() {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  if (done) {
    return <ResultPlan audience={audience} answers={answers} onRestart={prev} />;
  }

  // Translate question title + options
  const qKey = `q.${currentQ.id}`;
  const qTitle = t(`${qKey}.title`);
  const qSubtitle = currentQ.subtitle ? t(`${qKey}.s`) : '';
  const qOptions = currentQ.options.map((opt) => ({
    ...opt,
    label: t(`${qKey}.${opt.value}`),
  }));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span>
            {audience === 'particulier'
              ? t('diag.part.qN').replace('{n}', String(step + 1)).replace('{total}', String(totalSteps))
              : t('diag.part.qN').replace('{n}', String(step + 1)).replace('{total}', String(totalSteps))
            }
          </span>
          <span>
            {t('diag.part.pct').replace('{p}', String(progress))}
          </span>
        </div>
        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{qTitle}</h2>
        {qSubtitle && <p className="text-ink-500 mb-6">{qSubtitle}</p>}

        <div className="space-y-2">
          {qOptions.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => choose(opt.value)}
                className={
                  'w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ' +
                  (isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-ink-200 hover:border-ink-300 bg-white text-ink-800')
                }
              >
                <span className="font-medium">{opt.label}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('common.prev')}
          </button>
          <button
            onClick={next}
            disabled={!selected}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === totalSteps - 1 ? t('diag.part.seePlan') : t('common.next')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
