import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function Page() {
  return (
    <section className="container-page py-16 prose prose-ink max-w-3xl">
      <h1>Politique de confidentialité</h1>
      <p className="text-ink-500">Dernière mise à jour : juillet 2026</p>

      <h2>Données collectées</h2>
      <p>
        Lors de ton diagnostic, nous collectons : adresse email (si fournie),
        réponses au questionnaire, et données techniques (adresse IP, user
        agent) à des fins de sécurité et d'analyse.
      </p>

      <h2>Finalités</h2>
      <ul>
        <li>Fournir le service de diagnostic et de plan d'économies</li>
        <li>Envoyer la newsletter si tu y as consenti</li>
        <li>Améliorer le produit (analyses agrégées anonymes)</li>
      </ul>

      <h2>Base légale</h2>
      <p>Consentement (newsletter), intérêt légitime (amélioration produit), exécution du contrat (Premium).</p>

      <h2>Durée de conservation</h2>
      <p>Les données du diagnostic sont conservées tant que ton compte est actif. Tu peux demander la suppression à tout moment.</p>

      <h2>Tiers</h2>
      <p>
        Nous utilisons Vercel (hébergement), Supabase (données, optionnel),
        Resend (emails, optionnel), PostHog (analytics, optionnel). Aucun
        transfert commercial de tes données.
      </p>

      <h2>Cookies</h2>
      <p>Nous utilisons des cookies techniques et analytiques. Aucun cookie publicitaire.</p>

      <h2>Tes droits</h2>
      <p>
        Conformément au RGPD, tu disposes d'un droit d'accès, de
        rectification, de suppression, de portabilité et d'opposition. Pour
        exercer ces droits : <a href="mailto:hello@economies-malin.fr">hello@economies-malin.fr</a>.
      </p>

      <h2>Réclamation</h2>
      <p>Tu peux introduire une réclamation auprès de la CNIL.</p>
    </section>
  );
}
