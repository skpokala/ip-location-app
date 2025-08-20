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
    const isLoginPage = children.toString().includes('login');

    // If not logged in and not on login page, redirect to login
    if (!session && !isLoginPage) {
      redirect('/login');
    }

    // If logged in and on login page, redirect to home
    if (session && isLoginPage) {
      redirect('/');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // If there's an authentication error, allow access to login page
    const isLoginPage = children.toString().includes('login');
    if (!isLoginPage) {
      redirect('/login');
    }
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