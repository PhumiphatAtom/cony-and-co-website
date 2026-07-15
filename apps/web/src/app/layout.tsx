import type { Metadata } from 'next';
import { Fredoka, Prompt } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-en',
  display: 'swap',
});

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-th',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cony & Co.',
  description: 'ตุ๊กตากระต่ายสุดน่ารัก แต่ละตัวมีคาแรกเตอร์เป็นของตัวเอง',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${fredoka.variable} ${prompt.variable}`}>
      <body className="bg-background font-body text-brand antialiased">{children}</body>
    </html>
  );
}
