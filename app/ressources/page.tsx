import Link from 'next/link';
import { ArrowRight, Zap, Banknote, Receipt, ShieldCheck, HeartPulse, Briefcase, Car, ShoppingCart, Home, Wifi, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Ressources — Toutes nos fiches action pour économiser',
  description: '12 fiches action concrètes pour économiser sur l\'énergie, la banque, les abonnements, les impôts, le transport, etc.',
};

const fiches = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Énergie : changer de fournisseur',
    impact: '+ 240 €/an',
    effort: 'Facile',
    summary: 'Comparateur, fournisseurs alternatifs, comment résilier en 5 min.',
  },
  {
    icon: <Banknote className="w-5 h-5" />,
    title: 'Banque : passer en ligne',
    impact: '+ 180 €/an',
    effort: 'Moyen',
    summary: 'Comparatif Boursorama, Fortuneo, Hello Bank + comment migrer.',
  },
  {
    icon: <Receipt className="w-5 h-5" />,
    title: 'Audit de tes abonnements',
    impact: '+ 320 €/an',
    effort: 'Facile',
    summary: 'La méthode en 30 min pour récupérer des centaines d\'euros.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Assurance habitation & auto',
    impact: '+ 200 €/an',
    effort: 'Facile',
    summary: 'Résilier à tout moment après 1 an (loi Lemoine).',
  },
  {
    icon: <Home className="w-5 h-5" />,
    title: 'Crédit d\'impôt & aides au logement',
    impact: '+ 350 €/an',
    effort: 'Moyen',
    summary: 'Emploi à domicile, dons, garde d\'enfant, travaux.',
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    title: 'Optimiser ses courses',
    impact: '+ 1 100 €/an',
    effort: 'Moyen',
    summary: 'Drive, marques distributeur, anti-gaspi, promos ciblées.',
  },
  {
    icon: <Car className="w-5 h-5" />,
    title: 'Covoiturage & forfait mobilités',
    impact: '+ 600 €/an',
    effort: 'Moyen',
    summary: 'Forfait mobilités durables (800 €/an exonérés) + Blablacar Daily.',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: 'Forfait mobile & box',
    impact: '+ 220 €/an',
    effort: 'Facile',
    summary: 'Sosh / Free / B&You à 5-10 €/mois. Freebox Pop vs Livebox premium.',
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Comptabilité entrepreneur',
    impact: '+ 360 €/an',
    effort: 'Moyen',
    summary: 'Pennylane, Indy, Dougs, Tiime : comparatif pour auto-entrepreneur.',
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: 'Audit des outils SaaS',
    impact: '+ 1 200 €/an',
    effort: 'Moyen',
    summary: 'Checklist des doublons et licences inutilisées.',
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    title: 'Mutuelle Madelin / TNS',
    impact: '+ 550 €/an',
    effort: 'Moyen',
    summary: 'Comparer les contrats, déduire du bénéfice imposable.',
  },
  {
    icon: <Banknote className="w-5 h-5" />,
    title: 'Banque pro : Qonto / Shine / Indy',
    impact: '+ 280 €/an',
    effort: 'Facile',
    summary: 'Les néobanques pro sont 80-90% moins chères.',
  },
];

export default function RessourcesPage() {
  return (
    <section className="container-page py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">12 fiches action pour économiser</h1>
        <p className="mt-3 text-ink-600">
          Le même contenu qu'on utilise dans nos diagnostics, en libre accès.
          Chaque fiche : impact, effort, méthode pas à pas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {fiches.map((f, i) => (
          <div key={i} className="card group hover:border-brand-300 hover:shadow-soft transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                {f.icon}
              </div>
              <span className="ml-auto badge bg-brand-50 text-brand-700">
                {f.impact}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-brand-700 transition-colors">
              {f.title}
            </h3>
            <p className="text-sm text-ink-600 mb-3">{f.summary}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-500">Effort : {f.effort}</span>
              <span className="text-brand-700 font-medium inline-flex items-center">
                Lire la fiche
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-ink-500 mb-4">Tu veux un plan personnalisé ?</p>
        <Link href="/diagnostic" className="btn-primary">
          Faire mon diagnostic gratuit
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}
