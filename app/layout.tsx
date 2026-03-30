import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import JsonLd from './components/JsonLd';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pokédex',
  description: 'Browse random Pokémon and view their details.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pokédex',
    description: 'Browse random Pokémon and view their details.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning // prevent chrome extensions from causing hydration mismatches
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <JsonLd data={jsonLd} />
        {children}
      </body>
    </html>
  );
}
