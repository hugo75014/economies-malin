import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Conditions Générales d\'Utilisation' };

export default function Page() {
  return (
    <section className="container-page py-16 prose prose-ink max-w-3xl">
      <h1>Conditions Générales d'Utilisation</h1>
      <p className="text-ink-500">Dernière mise à jour : juillet 2026</p>

      <h2>1. Objet</h2>
      <p>
        Économies Malin propose un service gratuit d'aide au repérage de
        leviers d'économies pour particuliers et entrepreneurs. Les
        recommandations fournies le sont à titre indicatif et ne constituent
        pas un conseil financier, fiscal ou juridique personnalisé.
      </p>

      <h2>2. Inscription</h2>
      <p>
        L'utilisation du diagnostic est gratuite et sans inscription. Pour
        bénéficier de fonctionnalités Premium, un compte peut être requis.
      </p>

      <h2>3. Données personnelles</h2>
      <p>
        Les données collectées sont traitées conformément à notre{' '}
        <a href="/confidentialite">politique de confidentialité</a> et au RGPD.
      </p>

      <h2>4. Limitation de responsabilité</h2>
      <p>
        Les économies estimées sont calculées sur la base de moyennes
        observées. Les résultats réels dépendent de ta situation. Économies
        Malin ne saurait être tenu responsable des décisions prises sur la
        base de nos recommandations.
      </p>

      <h2>5. Modification des CGU</h2>
      <p>
        Nous nous réservons le droit de modifier les présentes CGU. Les
        utilisateurs seront informés de toute modification substantielle.
      </p>
    </section>
  );
}
