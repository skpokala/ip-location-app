import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check if credentials match our hardcoded values
        if (credentials.username === 'admin') {
          // In a real app, you'd hash the password when creating the user
          // and store it in a database. Here we're just comparing with
          // a hardcoded value for demonstration.
          const isValid = credentials.password === 'password123';

          if (isValid) {
            return {
              id: '1',
              name: 'Admin',
              email: 'admin@example.com',
            };
          }
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};
