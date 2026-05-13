import type { Metadata } from 'next';
import { Manrope, Epilogue, Montserrat } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';
import { AppDataProvider } from '@/context/AppDataContext';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin'],
  display: 'swap',
  weight: ['700', '800', '900'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'PRC System | Zambezi Futures',
  description:
    'Football league registration and academy management system for youth talent development.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${epilogue.variable} ${montserrat.variable}`}
    >
      <head>
        {/* Bootstrap 5.3.3 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />
        {/* Material Symbols Outlined icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen d-flex flex-column">
        <SessionProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </SessionProvider>
        {/* Bootstrap JS (for collapse/toggler — no jQuery required) */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        />
      </body>
    </html>
  );
}
