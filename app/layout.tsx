import type { Metadata } from 'next';
import { Cinzel, Playfair_Display, EB_Garamond } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['700'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['400', '700'], style: ['normal', 'italic'] });
const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-garamond', weight: ['400', '700'], style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: 'La Gaceta de la Razón - 1793',
  description: 'Chatbot Educativo interactivo de la Revolución Francesa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cinzel.variable} ${playfair.variable} ${ebGaramond.variable}`}>
      <body className="font-garamond" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
