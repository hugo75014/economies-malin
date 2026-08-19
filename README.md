# Économies Malin — v0.1

SaaS d'économies pour particuliers et entrepreneurs (Europe, FR-only v0.1).

> Diagnostic gratuit en 2 min → plan d'économies personnalisé et chiffré.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom design system : couleurs `brand` & `ink`)
- **Supabase** (optionnel) : auth + DB pour Phase 2
- **Vercel** : hosting
- **Resend** (optionnel) : emails transactionnels

## Démarrage local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build production

```bash
npm run build
npm start
```

## Structure

```
app/
├── page.tsx                     # Landing
├── diagnostic/                  # Diagnostic Particulier
├── entrepreneur/                # Diagnostic Entrepreneur
├── tarifs/                      # Page pricing
├── ressources/                  # 12 fiches action
├── mentions-legales/            # Légal
├── cgu/
├── confidentialite/
└── api/waitlist/                # Capture email (POST + GET admin)

components/
├── Header.tsx
├── Footer.tsx
├── DiagnosticClient.tsx         # Flow de questions
└── ResultPlan.tsx               # Affichage du plan personnalisé

lib/
├── questions.ts                 # Questions Particulier & Entrepreneur
└── recommendations.ts           # Moteur de recommandation (règles)
```

## Roadmap

| Phase | Statut | Périmètre |
|---|---|---|
| **v0.1** | ✅ | Landing + diagnostic + plan + waitlist |
| Phase 2 | 🔜 | Auth + upload screenshot + analyse IA |
| Phase 3 | 🔜 | Premium + conseiller humain hybride |
| Phase 4 | 🔜 | Tracking économies + app mobile + EU |

Voir `ROADMAP.md` pour le détail complet.

## Variables d'environnement

Toutes optionnelles en v0.1 :

```env
# Supabase (Phase 2)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend (emails transactionnels)
RESEND_API_KEY=
FROM_EMAIL=hello@economies-malin.fr
```

Sans config, la waitlist écrit dans `data/waitlist.json` (fallback in-memory).

## Licence

Propriétaire — © 2026 Économies Malin.
