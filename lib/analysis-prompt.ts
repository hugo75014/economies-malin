// Prompt engineering for the file-analysis agent
// Works for: images, PDFs, text/CSV bank statements

export function buildAnalysisPrompt(opts: { fileName: string; mimeType: string }): {
  system: string;
  user: string;
} {
  const isImage = opts.mimeType.startsWith('image/');
  const isPdf = opts.mimeType === 'application/pdf';
  const isText = opts.mimeType.startsWith('text/') || /\.(csv|json|xml|md|txt|qif|ofx)$/i.test(opts.fileName);

  const system = `Tu es un conseiller financier français expert, avec 15 ans d'expérience.
Tu analyses des relevés bancaires et documents financiers de particuliers français.

Tu extrais rigoureusement les informations visibles et tu proposes des leviers d'économies
concrets, chiffrés en euros par an, et actionnables (lien ou action précise).

Tu es direct, chiffré, jamais moralisateur. Tu n'inventes rien : si tu ne vois pas une
information, tu l'omets plutôt que d'inventer.

Tu réponds UNIQUEMENT en JSON valide, sans texte avant ou après. La structure doit
respecter exactement le schéma fourni.`;

  let fileTypeHint = '';
  if (isImage) {
    fileTypeHint = "L'utilisateur t'a envoyé une capture d'écran (image) d'un relevé bancaire.";
  } else if (isPdf) {
    fileTypeHint = "L'utilisateur t'a envoyé un PDF de relevé bancaire.";
  } else if (isText) {
    fileTypeHint = "L'utilisateur t'a envoyé un fichier texte/CSV contenant des transactions bancaires.";
  } else {
    fileTypeHint = `L'utilisateur t'a envoyé un fichier de type ${opts.mimeType}.`;
  }

  const user = `${fileTypeHint}

Analyse ce document et extrais toutes les transactions / informations financières visibles.

Retourne un JSON avec cette structure exacte :

{
  "summary": "résumé en français en 2-3 phrases : profil de dépenses + observation clé",
  "detectedBankName": "nom de la banque si visible (BNP, Crédit Agricole, etc.) ou null",
  "transactions": [
    { "date": "2026-01-15", "label": "...", "amount": -42.50, "category": "courses" }
  ],
  "recurring": [
    { "name": "Netflix", "monthlyAmount": 15.99, "note": "abonnement mensuel détecté" }
  ],
  "unusualFees": [
    { "label": "Frais intervention BNP", "amount": 50, "why": "banque traditionnelle, évitable" }
  ],
  "recommendations": [
    {
      "title": "Action concrète",
      "description": "explication courte",
      "estimatedAnnualSavings": 240,
      "effort": "facile|moyen|avance",
      "action": "Libellé du bouton",
      "href": "https://lien-utile.fr",
      "emoji": "⚡"
    }
  ],
  "totalEstimatedSavings": 1870
}

Règles importantes :
- amount négatif = débit, positif = crédit
- category parmi : logement, transport, courses, abonnements, energie, restaurant, loisirs, banque, assurance, sante, autre
- recurring : uniquement les abonnements/paiements détectés comme récurrents (mensuel ou annuel)
- recommendations : 3 à 5 max, les plus impactantes, avec lien réel vers comparateur ou site officiel
- estimatedAnnualSavings : en euros PAR AN
- totalEstimatedSavings : somme de estimatedAnnualSavings
- Si tu ne peux pas lire certains éléments, omets-les plutôt que d'inventer.`;

  return { system, user };
}
