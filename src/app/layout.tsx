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
  try {
    const session = await getServerSession(authOptions);
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
    const isLoginPage = pathname === '/login';
    const isApiRoute = pathname.startsWith('/api/');

    // Allow API routes to be accessed without authentication
    if (isApiRoute) {
      return (
        <html lang="en">
          <body className="font-sans">
            <Providers>
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </body>
          </html>
        </Providers>
      );
    }

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
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
    const isLoginPage = pathname === '/login';
    
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
        </body>
      </html>
    </html>
  );
}