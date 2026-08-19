// Diagnostic questions for Particulier & Entrepreneur
// Used to drive a personalized savings plan

export type Audience = 'particulier' | 'entrepreneur';

export type QuestionOption = {
  value: string;
  label: string;
  hint?: string;
};

export type Question = {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
};

export const particulierQuestions: Question[] = [
  {
    id: 'logement',
    title: 'Tu es plutôt…',
    subtitle: 'Côté logement',
    options: [
      { value: 'proprietaire', label: 'Propriétaire' },
      { value: 'locataire', label: 'Locataire' },
      { value: 'heberge_gratuit', label: 'Hébergé à titre gratuit' },
    ],
  },
  {
    id: 'foyer',
    title: 'Vous êtes combien à la maison ?',
    options: [
      { value: '1', label: '1 personne' },
      { value: '2', label: '2 personnes' },
      { value: '3-4', label: '3 à 4 personnes' },
      { value: '5+', label: '5 personnes ou plus' },
    ],
  },
  {
    id: 'revenus',
    title: 'Revenus nets du foyer par mois ?',
    subtitle: 'Pour calibrer les leviers d\'économies réalistes',
    options: [
      { value: '<2000', label: 'Moins de 2 000 €' },
      { value: '2000-3500', label: '2 000 à 3 500 €' },
      { value: '3500-5000', label: '3 500 à 5 000 €' },
      { value: '>5000', label: 'Plus de 5 000 €' },
    ],
  },
  {
    id: 'energie',
    title: 'Fournisseur d\'énergie actuel',
    options: [
      { value: 'edf', label: 'EDF (tarif réglementé)' },
      { value: 'engie', label: 'Engie / autre historique' },
      { value: 'alternatif', label: 'Fournisseur alternatif (TotalEnergies, Ekwateur, etc.)' },
      { value: 'je_sais_pas', label: 'Je ne sais pas' },
    ],
  },
  {
    id: 'banque',
    title: 'Ta banque principale',
    options: [
      { value: 'en_ligne', label: 'Banque en ligne (Boursorama, Fortuneo, N26…)' },
      { value: 'traditionnelle', label: 'Banque traditionnelle (BNP, Crédit Agricole, Société Générale…)' },
      { value: 'neo', label: 'Néobanque (Revolut, Nickel, Lydia…)' },
      { value: 'aucune', label: 'Je n\'ai pas de compte' },
    ],
  },
  {
    id: 'abos',
    title: 'Combien d\'abonnements payants en ce moment ?',
    subtitle: 'Streaming, sport, musique, applis, box, gyms, cloud…',
    options: [
      { value: '0-2', label: '0 à 2' },
      { value: '3-5', label: '3 à 5' },
      { value: '6-10', label: '6 à 10' },
      { value: '10+', label: 'Plus de 10' },
    ],
  },
  {
    id: 'priorite',
    title: 'Ton plus gros poste de dépenses "qui pèse" ?',
    options: [
      { value: 'energie', label: 'Énergie (électricité, gaz)' },
      { value: 'logement', label: 'Logement (loyer ou crédit)' },
      { value: 'transport', label: 'Transport (essence, péage, leasing)' },
      { value: 'courses', label: 'Courses alimentaires' },
      { value: 'abos', label: 'Abonnements & loisirs' },
    ],
  },
];

export const entrepreneurQuestions: Question[] = [
  {
    id: 'statut',
    title: 'Ton statut juridique',
    options: [
      { value: 'ae', label: 'Auto-entrepreneur / micro-entreprise' },
      { value: 'sasu_eurl', label: 'SASU / EURL' },
      { value: 'sas_sarl', label: 'SAS / SARL' },
      { value: 'ei', label: 'Entreprise individuelle (au réel)' },
    ],
  },
  {
    id: 'ca',
    title: 'Chiffre d\'affaires annuel',
    options: [
      { value: '<30k', label: 'Moins de 30 000 €' },
      { value: '30-100k', label: '30 000 à 100 000 €' },
      { value: '100-300k', label: '100 000 à 300 000 €' },
      { value: '>300k', label: 'Plus de 300 000 €' },
    ],
  },
  {
    id: 'compta',
    title: 'Comptabilité gérée comment ?',
    options: [
      { value: 'logiciel', label: 'Logiciel en ligne (Pennylane, Indy, Dougs, Tiime…)' },
      { value: 'expert', label: 'Expert-comptable' },
      { value: 'tout_seul', label: 'Tout seul (tableur / papier)' },
      { value: 'rien', label: 'Je ne sais pas trop' },
    ],
  },
  {
    id: 'saas',
    title: 'Combien d\'outils SaaS payants utilisés par mois ?',
    subtitle: 'CRM, mailing, design, hébergement, visio, Notion, Slack, etc.',
    options: [
      { value: '0-3', label: '0 à 3' },
      { value: '4-8', label: '4 à 8' },
      { value: '9-15', label: '9 à 15' },
      { value: '15+', label: 'Plus de 15' },
    ],
  },
  {
    id: 'mutuelle',
    title: 'Mutuelle santé Madelin / TNS ?',
    options: [
      { value: 'oui_madelin', label: 'Oui, contrat Madelin / TNS' },
      { value: 'oui_basique', label: 'Oui, mais basique' },
      { value: 'non', label: 'Non' },
    ],
  },
  {
    id: 'banque_pro',
    title: 'Banque pro',
    options: [
      { value: 'en_ligne', label: 'Néobanque pro (Qonto, Shine, Indy…)' },
      { value: 'traditionnelle', label: 'Banque traditionnelle' },
      { value: 'perso', label: 'J\'utilise mon compte perso' },
    ],
  },
  {
    id: 'priorite',
    title: 'Ce qui pèse le plus dans tes charges ?',
    options: [
      { value: 'compta', label: 'Comptabilité & fiscal' },
      { value: 'saas', label: 'Outils SaaS' },
      { value: 'mutuelle', label: 'Mutuelle / prévoyance' },
      { value: 'local', label: 'Local / bureau' },
      { value: 'banque', label: 'Frais bancaires' },
    ],
  },
];
