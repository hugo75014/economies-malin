import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { I18nProvider } from '@/components/I18nProvider';
import PlatformBrandingRemover from '@/components/PlatformBrandingRemover';

export const metadata: Metadata = {
  metadataBase: new URL('https://economies-malin.fr'),
  title: {
    default: 'Économies Malin — Gagne 1 500 €/an sans changer de vie',
    template: '%s | Économies Malin',
  },
  description:
    'Diagnostic gratuit en 2 min : découvre où tu peux économiser sur l\'énergie, la banque, les abonnements, les impôts. Pour particuliers et entrepreneurs.',
  keywords: [
    'économies',
    'économiser',
    'particulier',
    'entrepreneur',
    'frais bancaires',
    'énergie',
    'mutuelle',
    'abonnements',
    'auto-entrepreneur',
  ],
  authors: [{ name: 'Économies Malin' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://economies-malin.fr',
    title: 'Économies Malin — Gagne 1 500 €/an sans changer de vie',
    description:
      'Diagnostic gratuit en 2 min. Personnalisé pour particuliers et entrepreneurs.',
    siteName: 'Économies Malin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Économies Malin',
    description: 'Diagnostic gratuit pour économiser sur tout',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <PlatformBrandingRemover />
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
