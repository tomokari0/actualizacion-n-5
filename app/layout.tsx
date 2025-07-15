import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { I18nProvider } from '@/lib/i18n/context';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tomflix - Watch TV Shows Online, Watch Movies Online',
  description: 'Watch Tomflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8922860413075053"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}