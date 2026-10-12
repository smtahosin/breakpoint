import type { Metadata } from 'next';
import '../styles/globals.css';
import ClientShell from '../components/ClientShell';

export const metadata: Metadata = {
  title: 'BreakPoint — The Developer\'s 20-Minute Cognitive Reset & Sunlight Dispatcher',
  description: 'Translate software breakpoints into human biology. Step outside, clear your mind, let your brain enter diffuse mode, and find better solutions. Built for Hacktoberfest 2026.',
  keywords: ['developer health', 'diffuse mode', 'cognitive reset', 'solar data', 'hacktoberfest 2026', 'touch grass'],
  authors: [{ name: 'S M Tahosin', url: 'https://github.com/smtahosin' }],
  openGraph: {
    title: 'BreakPoint ☀️ — Step Outside. Clear Your Mind. Find Better Solutions.',
    description: 'The Developer\'s 20-Minute Cognitive Reset & Sunlight Dispatcher.',
    type: 'website',
    images: ['/images/hero-city-sunset.jpg'],
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☀️</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
