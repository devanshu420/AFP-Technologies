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
  title: 'AFP Technologies | Industrial Machinery for What Is Next',
  description:
    'Precision industrial equipment, engineering expertise, and responsive service for ambitious manufacturers.',

  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export const viewport = {
  colorScheme: 'light',
  themeColor: '#071b32',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable}`}>
        <div className="site-wrapper">
          <main className="site-main">
            {children}
          </main>
        </div>

        <Analytics />
      </body>
    </html>
  );
}