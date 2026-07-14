import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'DaanBaksho - Crowdfunding Platform',
  description: 'Fund the causes and creators you believe in.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
