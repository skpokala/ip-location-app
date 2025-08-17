import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'IP Location App',
  description: 'A simple app to show your public IP address',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}