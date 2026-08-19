import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function Page() {
  return (
    <section className="container-page py-16 prose prose-ink max-w-3xl">
      <h1>Mentions légales</h1>
      <p className="text-ink-500">Dernière mise à jour : juillet 2026</p>

      <h2>Éditeur du site</h2>
      <p>
        <strong>Économies Malin</strong> — SAS en cours d'immatriculation.<br />
        Siège social : Paris, France.<br />
        Email : hello@economies-malin.fr<br />
        Directeur de la publication : [À compléter]
      </p>

      <h2>Hébergement</h2>
      <p>Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus (textes, images, logos, codes) est la propriété
        exclusive d'Économies Malin, sauf mention contraire. Toute reproduction
        sans autorisation est interdite.
      </p>

      <h2>Contact</h2>
      <p>hello@economies-malin.fr</p>
    </section>
  );
}
