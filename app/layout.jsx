import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-family',
});

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'AFP Technologies. | Industrial machinery for what is next',
  description:
    'Precision industrial equipment, engineering expertise, and responsive service for ambitious manufacturers.',
  generator: 'v0.app',
};

export const viewport = {
  colorScheme: 'light',
  themeColor: '#071b32',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}