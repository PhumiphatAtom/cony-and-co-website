import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cony & Co.',
  description: 'ตุ๊กตากระต่ายสุดน่ารัก แต่ละตัวมีคาแรกเตอร์เป็นของตัวเอง',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
