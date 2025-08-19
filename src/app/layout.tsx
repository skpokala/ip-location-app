import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Footer from '@/components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/auth.config';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'IP Location App',
  description: 'A simple app to show your public IP address',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  
  // Allow API routes to be accessed without authentication
  if (pathname.startsWith('/api/')) {
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

  // For local development, allow access to main page without authentication
  if (process.env.NODE_ENV === 'development') {
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