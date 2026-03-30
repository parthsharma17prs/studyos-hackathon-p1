import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'StudyOS — The Complete AI Student Platform',
  description:
    'The AI platform that knows you — your notes, your marks, your gaps, your goals. Built at Hack-A-Sprint 2026.',
  keywords: ['AI', 'study', 'platform', 'quiz', 'education', 'hackathon'],
  openGraph: {
    title: 'StudyOS — The Complete AI Student Platform',
    description: 'Study smarter. Not harder.',
    type: 'website',
  },
};

import ScrollEffects from '@/components/shared/ScrollEffects';
import LoadingScreen from '@/components/shared/LoadingScreen';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-os-black text-white min-h-screen antialiased`}>
        <LoadingScreen />
        <ScrollEffects />
        {children}
      </body>
    </html>
  );
}
