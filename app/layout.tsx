import type { Metadata } from 'next';
import './globals.css';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MedIoT',
    template: '%s | MedIoT',
  },
  description: 'MedIoT combines AI and IoT to turn health signals into calm, actionable care.',
  generator: 'MedIoT',
  applicationName: 'MedIoT',
  keywords: ['MedIoT', 'AI healthcare', 'IoT monitoring', 'predictive diagnostics'],
  openGraph: {
    title: 'MedIoT',
    description: 'AI and IoT working together for predictive healthcare.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} antialiased`}>{children}</body>
    </html>
  );
}
