import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'IP Location App',
  description: 'A simple app to show your public IP address',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}