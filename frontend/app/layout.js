import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' });

export const metadata = {
  title: { default: 'RSN CAFE — Kalpitiya', template: '%s · RSN CAFE' },
  description: 'Order coffee, tea and food from RSN CAFE in Kalpitiya. Pay online or at the counter and get SMS updates.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
