import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import SiteShell from '@/app/components/layout/SiteShell';
import { SITE_NAME, SITE_URL } from '@/app/lib/site';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Senior Software Engineer`,
  description:
    'Personal portfolio of Charly Micolas Butarbutar, also known as Charly Butarbutar or Charly Micolas. Senior Software Engineer focused on backend systems and technical leadership.',
  keywords: [
    'Charly Micolas',
    SITE_NAME,
    'Backend Engineer',
    'Software Engineer',
    'Tech Lead',
    'Jakarta',
    'Indonesia',
    'Go',
    'Java',
    'Microservices',
    'PostgreSQL',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: `${SITE_NAME} | Senior Software Engineer`,
    description:
      'Editorial portfolio of Charly Micolas Butarbutar, a backend-focused Senior Software Engineer specialising in technical leadership, service integration, and reliable delivery.',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${firaCode.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
