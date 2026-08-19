// Mock LLM response — used when no API key is configured
// Gives a realistic, fully-formed analysis so the demo works out-of-the-box.

import type { AnalysisOutput } from './llm';

export function mockAnalyze(): AnalysisOutput {
  return {
    summary:
      "Sur ton relevé, j'identifie 8 abonnements dont 2 probablement inutilisés, des frais bancaires évitables, et 3 abonnements que tu peux regrouper ou résilier. Potentiel d'économies : 1 870 €/an sans effort.",
    transactions: [
      { date: '2026-08-01', label: 'LOYER', amount: -920, category: 'logement' },
      { date: '2026-08-02', label: 'CARREFOUR', amount: -127.45, category: 'courses' },
      { date: '2026-08-03', label: 'EDF', amount: -89.3, category: 'energie' },
      { date: '2026-08-05', label: 'NETFLIX', amount: -15.99, category: 'abonnements' },
      { date: '2026-08-05', label: 'SPOTIFY', amount: -11.99, category: 'abonnements' },
      { date: '2026-08-06', label: 'FREE MOBILE', amount: -19.99, category: 'abonnements' },
      { date: '2026-08-06', label: 'SALLE SPORT BASIC-FIT', amount: -24.99, category: 'abonnements' },
      { date: '2026-08-07', label: 'UBER EATS', amount: -38.5, category: 'restaurant' },
      { date: '2026-08-08', label: 'AMAZON PRIME', amount: -6.99, category: 'abonnements' },
      { date: '2026-08-08', label: 'FRAIS TENUE COMPTE', amount: -8.5, category: 'banque' },
      { date: '2026-08-10', label: 'CARREFOUR', amount: -94.2, category: 'courses' },
      { date: '2026-08-12', label: 'APPLE.COM/BILL', amount: -9.99, category: 'abonnements' },
      { date: '2026-08-12', label: 'ESSENCE TOTAL', amount: -65.4, category: 'transport' },
      { date: '2026-08-14', label: 'DISNEY+', amount: -8.99, category: 'abonnements' },
      { date: '2026-08-15', label: 'SALAIRE', amount: 2450, category: 'autre' },
    ],
    recurring: [
      { name: 'Netflix', monthlyAmount: 15.99, note: 'abonnement mensuel standard' },
      { name: 'Spotify', monthlyAmount: 11.99, note: 'forfait individuel, Family dispo à 16,99€ pour 6' },
      { name: 'Basic-Fit', monthlyAmount: 24.99, note: 'fréquentation à vérifier' },
      { name: 'Amazon Prime', monthlyAmount: 6.99, note: 'soit 83,88 €/an — annuel = 49 €' },
      { name: 'Disney+', monthlyAmount: 8.99, note: 'peut être groupé avec Spotify/Canal+' },
      { name: 'Apple iCloud+', monthlyAmount: 9.99, note: 'plan 200 Go, à ajuster' },
      { name: 'Free Mobile', monthlyAmount: 19.99, note: 'Sosh 5€/mois suffisant si < 50 Go' },
      { name: 'Frais tenue compte', monthlyAmount: 8.5, note: 'à supprimer en passant en banque en ligne' },
    ],
    unusualFees: [
      {
        label: 'Frais tenue de compte',
        amount: 8.5,
        why: 'Banque traditionnelle, disparaît en passant chez Boursorama/Fortuneo',
      },
      {
        label: 'Basic-Fit non utilisé',
        amount: 24.99,
        why: "Si moins de 4 visites/mois, l'abonnement n'est pas rentabilisé",
      },
    ],
    recommendations: [
      {
        title: 'Passer en banque en ligne (Boursorama)',
        description:
          'Ta banque te prélève 8,50 €/mois rien que pour la tenue de compte, plus les commissions d\'intervention. Boursorama propose la gratuité totale (0 €/an) avec une carte Visa Premier.',
        estimatedAnnualSavings: 180,
        effort: 'moyen',
        action: 'Voir Boursorama',
        href: 'https://www.boursorama-banque.com/',
        emoji: '🏦',
      },
      {
        title: 'Mutualiser Spotify + Disney+',
        description:
          'Les forfaits groupés Disney+/Spotify/Canal+ via les offres partenaires (ex. Free Mobile) coûtent souvent 12-14 €/mois pour les 3 au lieu de 24 € séparés.',
        estimatedAnnualSavings: 120,
        effort: 'facile',
        action: 'Voir les offres groupées',
        href: 'https://www.ariase.com/box/forfait-mobile',
        emoji: '🎬',
      },
      {
        title: 'Forfait Free Mobile → Sosh 5€',
        description:
          'Si tu consommes moins de 50 Go/mois, le forfait Sosh à 4,99 € suffit largement et inclut les appels/SMS/MMS illimités.',
        estimatedAnnualSavings: 180,
        effort: 'facile',
        action: 'Voir Sosh',
        href: 'https://shop.sosh.fr/forfaits',
        emoji: '📱',
      },
      {
        title: 'Tester Basic-Fit 1 mois sans engagement',
        description:
          "Résilie Basic-Fit (24,99 €/mois) et utilise un pass à l'unité 9,90 € les mois où tu y vas vraiment. Si tu y vas moins de 3 fois/mois, c'est rentable.",
        estimatedAnnualSavings: 180,
        effort: 'facile',
        action: 'Résilier Basic-Fit',
        href: 'https://www.basic-fit.com/fr-fr/help/resilier-mon-abonnement',
        emoji: '💪',
      },
      {
        title: 'Comparer les fournisseurs d\'énergie',
        description:
          "EDF tarif réglementé est rarement compétitif. TotalEnergies ou Mint Énergie proposent souvent 100-200 €/an de moins pour les mêmes kWh.",
        estimatedAnnualSavings: 240,
        effort: 'facile',
        action: 'Comparer sur Selectra',
        href: 'https://comparateur.selectra.info/',
        emoji: '⚡',
      },
    ],
    totalEstimatedSavings: 900,
  };
}
