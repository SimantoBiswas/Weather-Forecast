import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurora — Premium Weather Dashboard',
  description:
    'A premium, futuristic weather dashboard with real-time conditions, hourly and 7-day forecasts, air quality, UV index, and sunrise/sunset insights — powered by Open-Meteo.',
  keywords: [
    'weather app',
    'weather dashboard',
    'forecast',
    'Open-Meteo',
    'air quality',
    'UV index',
    'Next.js weather app',
  ],
  authors: [{ name: 'Aurora Weather' }],
  openGraph: {
    title: 'Aurora — Premium Weather Dashboard',
    description:
      'Real-time weather, hourly & 7-day forecasts, air quality and more in a sleek glassmorphism interface.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurora — Premium Weather Dashboard',
    description:
      'Real-time weather, hourly & 7-day forecasts, air quality and more in a sleek glassmorphism interface.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05060f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="custom-cursor">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
