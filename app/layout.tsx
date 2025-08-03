import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedIoT',
  description: 'Created with Wasim',
  generator: 'Sk wasimuddin',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
