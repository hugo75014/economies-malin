// Recommendation engine — generates a personalized savings plan
// from diagnostic answers. Rule-based for v0.1; can be upgraded to LLM later.

import { particulierQuestions, entrepreneurQuestions } from './questions';

export type Answers = Record<string, string>;

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  estimatedAnnualSavings: number; // in euros
  effort: 'facile' | 'moyen' | 'avance';
  category: 'energie' | 'banque' | 'abos' | 'assurance' | 'fiscal' | 'transport' | 'courses' | 'compta' | 'mutuelle' | 'saas' | 'banque_pro' | 'local' | 'prelevements';
  action: string; // CTA label
  href: string;
  emoji: string;
};

const PARTICULIER_BASE: Recommendation[] = [
  {
    id: 'energie-prix',
    title: 'Comparer les fournisseurs d\'énergie',
    description:
      'EDF tarif réglementé n\'est presque jamais le moins cher. Un comparateur te montre en 2 min combien tu peux économiser en passant chez un fournisseur alternatif (TotalEnergies, Mint Énergie, Ekwateur, Alpiq…).',
    estimatedAnnualSavings: 240,
    effort: 'facile',
    category: 'energie',
    action: 'Voir le comparateur',
    href: 'https://comparateur.selectra.info/',
    emoji: '⚡',
  },
  {
    id: 'banque-frais',
    title: 'Frais bancaires : payer moins (ou 0)',
    description:
      'Les banques traditionnelles facturent 80-300 €/an de frais de tenue + commissions d\'intervention. Une banque en ligne (Boursorama, Fortuneo) propose la gratuité totale. Si tu as besoin d\'agence, regarde Fortuneo ou Hello Bank.',
    estimatedAnnualSavings: 180,
    effort: 'moyen',
    category: 'banque',
    action: 'Voir les offres',
    href: 'https://www.boursorama-banque.com/',
    emoji: '🏦',
  },
  {
    id: 'abos-audit',
    title: 'Audit de tes abonnements',
    description:
      'En moyenne un foyer français dépense 600-900 €/an en abonnements qu\'il utilise peu. 30 minutes pour tout lister + résilier ce qui sert pas = des centaines d\'euros.',
    estimatedAnnualSavings: 320,
    effort: 'facile',
    category: 'abos',
    action: 'Voir la méthode',
    href: '/ressources/audit-abonnements',
    emoji: '📺',
  },
  {
    id: 'assurance-habitation',
    title: 'Renégocier l\'assurance habitation & auto',
    description:
      'La loi Lemoine (2022) te permet de résilier à tout moment après 1 an. Comparer 5 minutes = -20 à -40% sur la prime annuelle.',
    estimatedAnnualSavings: 200,
    effort: 'facile',
    category: 'assurance',
    action: 'Comparer maintenant',
    href: 'https://www.lemonde.fr/guides-d-achat/',
    emoji: '🛡️',
  },
  {
    id: 'fiscal-credit',
    title: 'Vérifier tes crédits d\'impôt',
    description:
      'Emploi à domicile, dons, garde d\'enfant, travaux de rénovation énergétique… Tu laisses probablement 200 à 600 €/an sur la table.',
    estimatedAnnualSavings: 350,
    effort: 'moyen',
    category: 'fiscal',
    action: 'Voir la liste',
    href: 'https://www.service-public.fr/particuliers/vosdroits/F35',
    emoji: '🧾',
  },
  {
    id: 'courses-optimisation',
    title: 'Optimiser tes courses alimentaires',
    description:
      'Drive vs magasin, marques distributeur, promos ciblées, anti-gaspi (Too Good To Go). 30% d\'économie facile sur le poste courses sans changer de régime.',
    estimatedAnnualSavings: 1100,
    effort: 'moyen',
    category: 'courses',
    action: 'Voir la méthode',
    href: 'https://toogoodtogo.com/fr',
    emoji: '🛒',
  },
  {
    id: 'transport-covoit',
    title: 'Trajets domicile-travail en covoiturage',
    description:
      'Avec le forfait mobilités durables (jusqu\'à 800 €/an exonérés) + Blablacar Daily, tu peux diviser par 3 le coût de tes trajets. Éligible dès 1 trajet/semaine de plus de 30 km.',
    estimatedAnnualSavings: 600,
    effort: 'moyen',
    category: 'transport',
    action: 'Tester Blablacar Daily',
    href: 'https://www.blablacardaily.com/',
    emoji: '🚗',
  },
  {
    id: 'telecom-forfait',
    title: 'Renégocier ton forfait mobile & box',
    description:
      'Sosh / Free Mobile / B&You proposent des forfaits à 5-10 €/mois là où tu paies peut-être 25-40 €. Idem pour la box : Freebox Pop est 4x moins chère qu\'une Livebox premium.',
    estimatedAnnualSavings: 220,
    effort: 'facile',
    category: 'abos',
    action: 'Voir les forfaits',
    href: 'https://www.free.fr/freebox/',
    emoji: '📱',
  },
];

const ENTREPRENEUR_BASE: Recommendation[] = [
  {
    id: 'compta-compare',
    title: 'Comparer les outils de compta en ligne',
    description:
      'Pennylane, Indy, Dougs, Tiime : tous entre 20 et 80 €/mois. Beaucoup d\'auto-entrepreneurs paient un outil trop complet (ou trop cher) pour leur vraie volumétrie.',
    estimatedAnnualSavings: 360,
    effort: 'moyen',
    category: 'compta',
    action: 'Comparer',
    href: 'https://www.indytax.com/',
    emoji: '📊',
  },
  {
    id: 'saas-audit',
    title: 'Audit des outils SaaS',
    description:
      'En moyenne 800-2 000 €/an gaspillés en SaaS non utilisés, doublons (3 outils de tracking, 2 CRM…), licences inutiles. Un audit de 1h te les fait récupérer.',
    estimatedAnnualSavings: 1200,
    effort: 'moyen',
    category: 'saas',
    action: 'Voir la checklist',
    href: '/ressources/audit-saas',
    emoji: '🧰',
  },
  {
    id: 'mutuelle-madelin',
    title: 'Optimiser ta mutuelle Madelin / TNS',
    description:
      'Le contrat Madelin est déductible du bénéfice imposable. Mais 70% des TNS prennent la première mutuelle venue — il y a souvent 400-800 €/an d\'écart entre les offres équivalentes.',
    estimatedAnnualSavings: 550,
    effort: 'moyen',
    category: 'mutuelle',
    action: 'Comparer les contrats',
    href: 'https://www.Comparateur-mutuelle-entreprise.fr/',
    emoji: '🩺',
  },
  {
    id: 'banque-pro-fees',
    title: 'Vérifier les frais de ta banque pro',
    description:
      'Qonto, Shine, Indy, Finom : pour une TPE/auto-entrepreneur, ces néobanques sont 80 à 90% moins chères qu\'une banque traditionnelle. Commission d\'intervention, frais de tenue, commission de mouvement : tout disparaît.',
    estimatedAnnualSavings: 280,
    effort: 'facile',
    category: 'banque_pro',
    action: 'Voir Qonto',
    href: 'https://qonto.com/fr',
    emoji: '🏛️',
  },
  {
    id: 'fiscal-defisc',
    title: 'Optimiser ta rémunération de dirigeant',
    description:
      'Dividendes vs salaire, PER (plan épargne retraite), déduction des frais réels, indemnités kilométriques, Madelin… Le bon mix peut te faire économiser 1 000 à 5 000 €/an d\'impôts.',
    estimatedAnnualSavings: 1800,
    effort: 'avance',
    category: 'fiscal',
    action: 'En parler à un expert',
    href: 'https://www.indy.fr/',
    emoji: '💰',
  },
  {
    id: 'prelevements-urssaf',
    title: 'Vérifier tes prélèvements URSSAF',
    description:
      'Auto-entrepreneur : tu paies peut-être trop si tu n\'as pas déclaré d\'ACRE, ou si tu dépasses les plafonds micro. 10 min de vérification = 200-600 €/an récupérés.',
    estimatedAnnualSavings: 400,
    effort: 'moyen',
    category: 'prelevements',
    action: 'Aller sur autoentrepreneur.urssaf.fr',
    href: 'https://www.autoentrepreneur.urssaf.fr/',
    emoji: '🏛️',
  },
  {
    id: 'local-coworking',
    title: 'Bureau : coworking vs bail',
    description:
      'Un bail 3-6-9 à 800 €/mois pour 5 m² dans Paris ? Les espaces de coworking (WeWork, Deskopolitan, Morning) sont souvent 50% moins chers pour un usage flexible. Si tu n\'as pas besoin d\'accueil client, c\'est tout bénéf.',
    estimatedAnnualSavings: 2400,
    effort: 'moyen',
    category: 'local',
    action: 'Voir les espaces',
    href: 'https://www.deskopolitan.com/',
    emoji: '🏢',
  },
  {
    id: 'energie-pro',
    title: 'Négocier l\'énergie de ton local pro',
    description:
      'Si tu as un local, ton contrat pro énergie n\'est probablement pas compétitif. Les pros négocient moins bien que les particuliers — il existe des courtiers énergie pro (opera-energie.com, hmarkets) qui font jouer la concurrence.',
    estimatedAnnualSavings: 600,
    effort: 'moyen',
    category: 'energie',
    action: 'Comparer pro',
    href: 'https://opera-energie.com/',
    emoji: '⚡',
  },
];

// Function that filters and ranks recommendations based on answers
export function buildPlan(audience: 'particulier' | 'entrepreneur', answers: Answers): Recommendation[] {
  const base = audience === 'particulier' ? PARTICULIER_BASE : ENTREPRENEUR_BASE;

  // Compute a priority boost based on what the user signaled as a pain point
  const priority = answers.priorite;
  type BoostMap = Record<string, Record<string, string[]>>;
  const boostMap: BoostMap = {
    particulier: {
      energie: ['energie-prix', 'telecom-forfait'],
      logement: ['assurance-habitation', 'fiscal-credit'],
      transport: ['transport-covoit', 'telecom-forfait'],
      courses: ['courses-optimisation', 'abos-audit'],
      abos: ['abos-audit', 'telecom-forfait'],
    },
    entrepreneur: {
      compta: ['compta-compare', 'prelevements-urssaf'],
      saas: ['saas-audit', 'compta-compare'],
      mutuelle: ['mutuelle-madelin', 'fiscal-defisc'],
      local: ['local-coworking', 'energie-pro'],
      banque: ['banque-pro-fees', 'prelevements-urssaf'],
    },
  };

  // Boosting
  const boosted = [...base];
  const boosts = boostMap[audience][priority] ?? [];
  boosted.sort((a, b) => {
    const aBoost = boosts.includes(a.id) ? 1 : 0;
    const bBoost = boosts.includes(b.id) ? 1 : 0;
    return bBoost - aBoost;
  });

  // Personalize: banque traditionnelle → boost banque rec; trad énergie → boost énergie rec
  if (audience === 'particulier') {
    if (answers.banque === 'traditionnelle') {
      boosted.sort((a, b) => (b.id === 'banque-frais' ? 1 : 0) - (a.id === 'banque-frais' ? 1 : 0));
    }
    if (answers.energie === 'edf' || answers.energie === 'engie') {
      boosted.sort((a, b) => (b.id === 'energie-prix' ? 1 : 0) - (a.id === 'energie-prix' ? 1 : 0));
    }
    if (answers.abos === '6-10' || answers.abos === '10+') {
      boosted.sort((a, b) => (b.id === 'abos-audit' ? 1 : 0) - (a.id === 'abos-audit' ? 1 : 0));
    }
  }
  if (audience === 'entrepreneur') {
    if (answers.banque_pro === 'traditionnelle' || answers.banque_pro === 'perso') {
      boosted.sort((a, b) => (b.id === 'banque-pro-fees' ? 1 : 0) - (a.id === 'banque-pro-fees' ? 1 : 0));
    }
    if (answers.mutuelle === 'non' || answers.mutuelle === 'oui_basique') {
      boosted.sort((a, b) => (b.id === 'mutuelle-madelin' ? 1 : 0) - (a.id === 'mutuelle-madelin' ? 1 : 0));
    }
    if (answers.saas === '9-15' || answers.saas === '15+') {
      boosted.sort((a, b) => (b.id === 'saas-audit' ? 1 : 0) - (a.id === 'saas-audit' ? 1 : 0));
    }
  }

  // Return top 5
  return boosted.slice(0, 5);
}

export function totalSavings(plan: Recommendation[]): number {
  return plan.reduce((sum, r) => sum + r.estimatedAnnualSavings, 0);
}

export function getQuestionsFor(audience: 'particulier' | 'entrepreneur') {
  return audience === 'particulier' ? particulierQuestions : entrepreneurQuestions;
}

export function getQuestionIds(audience: 'particulier' | 'entrepreneur'): string[] {
  return getQuestionsFor(audience).map((q) => q.id);
}
