import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Le Monde6 — Actualite, analyses et informations',
    template: '%s | Le Monde6',
  },
  description:
    "Le Monde6 — Toute l'actualite en France et dans le monde : politique, economie, culture, science, international.",
  keywords: ['actualite', 'news', 'france', 'politique', 'economie', 'culture', 'science'],
  authors: [{ name: 'Le Monde6' }],
  creator: 'Le Monde6',
  publisher: 'Le Monde6',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'Le Monde6',
    title: 'Le Monde6 — Actualite, analyses et informations',
    description: "Toute l'actualite en France et dans le monde",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Le Monde6',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Monde6',
    description: "Toute l'actualite en France et dans le monde",
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
