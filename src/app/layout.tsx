import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Footer from '@/components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/auth.config';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'IP Location App',
  description: 'A simple app to show your public IP address',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);
    
    // Simple approach: if there's no session, allow access to all pages
    // The individual pages will handle their own authentication logic
    if (!session) {
      // Allow access to all pages when not authenticated
      // Individual pages will redirect to login if needed
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // If there's an authentication error, allow access to all pages
    // Individual pages will handle their own authentication logic
  }

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