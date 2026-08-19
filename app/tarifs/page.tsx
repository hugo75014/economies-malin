import Link from 'next/link';
import { Check, X, Sparkles, Crown } from 'lucide-react';

export const metadata = {
  title: 'Tarifs — Gratuit pour commencer, Premium pour aller plus loin',
  description: 'Le diagnostic est gratuit. Le Premium accompagne sur la durée avec un conseiller humain et le suivi des économies.',
};

const features = {
  free: [
    { ok: true, text: 'Diagnostic illimité' },
    { ok: true, text: 'Plan personnalisé avec 3-5 actions' },
    { ok: true, text: 'Fiches action détaillées' },
    { ok: false, text: 'Suivi des économies réelles' },
    { ok: false, text: 'Alertes opportunités (énergie, banque…)' },
    { ok: false, text: 'Audit IA sur capture d\'écran bancaire' },
    { ok: false, text: '1 visio / mois avec conseiller' },
    { ok: false, text: 'Garantie satisfait ou remboursé' },
  ],
  premium: [
    { ok: true, text: 'Tout du Gratuit' },
    { ok: true, text: 'Suivi des économies réelles (tableau de bord)' },
    { ok: true, text: 'Alertes opportunités hebdo' },
    { ok: true, text: 'Audit IA sur capture d\'écran bancaire' },
    { ok: true, text: '1 visio 15 min / mois avec conseiller' },
    { ok: true, text: 'Garantie satisfait ou remboursé 30j' },
  ],
};

export default function TarifsPage() {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Tarifs simples, transparents</h1>
        <p className="mt-3 text-ink-600">
          Commence gratuitement. Passe Premium quand tu veux aller plus loin.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gratuit</h2>
              <p className="text-sm text-ink-500">Pour démarrer</p>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold">0 €</span>
            <span className="text-ink-500"> / toujours</span>
          </div>
          <ul className="space-y-2.5 mb-6">
            {features.free.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {f.ok ? (
                  <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-ink-300 mt-0.5 shrink-0" />
                )}
                <span className={f.ok ? 'text-ink-700' : 'text-ink-400 line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <Link href="/diagnostic" className="btn-secondary w-full">
            Faire mon diagnostic gratuit
          </Link>
        </div>

        {/* Premium */}
        <div className="card border-2 border-brand-500 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Le plus populaire
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Premium</h2>
              <p className="text-sm text-ink-500">Pour les économies sérieuses</p>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold">9,90 €</span>
            <span className="text-ink-500"> / mois · sans engagement</span>
            <p className="text-xs text-ink-500 mt-1">~ 100 € pour la 1ère année, ROI dès 1 action</p>
          </div>
          <ul className="space-y-2.5 mb-6">
            {features.premium.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                <span className="text-ink-700">{f.text}</span>
              </li>
            ))}
          </ul>
          <Link href="/diagnostic" className="btn-primary w-full">
            Essayer Premium
          </Link>
          <p className="text-xs text-ink-500 text-center mt-2">
            Garantie satisfait ou remboursé 30 jours
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-ink-500 mt-12 max-w-2xl mx-auto">
        <p>
          💡 En moyenne, nos utilisateurs Premium économisent 1 870 €/an. Le
          service se rentabilise dès la première action réalisée.
        </p>
      </div>
    </section>
  );
}
