import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
