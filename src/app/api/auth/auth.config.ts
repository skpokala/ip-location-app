import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

// In a real app, this would be in a database
let user = {
  id: '1',
  username: 'admin',
  // Use password hash from env var, or hash the plain password from env var, or use default hash for 'password'
  passwordHash: process.env.ADMIN_PASSWORD_HASH || 
    (process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : '$2b$10$0OXdnHEfFl4vDR4NRnxHfezacsmjqpXLo8Hmjtp2woPei35ySbzi6'),
  totpSecret: null as string | null,
  totpEnabled: false,
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        totp: { label: "TOTP Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check if username matches
        if (credentials.username !== user.username) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // If TOTP is enabled, verify the code
        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.totp) {
            throw new Error('TOTP_REQUIRED');
          }
          
          try {
            const isValidTOTP = authenticator.verify({ token: credentials.totp, secret: user.totpSecret });
            if (!isValidTOTP) {
              throw new Error('Invalid TOTP code');
            }
          } catch (error) {
            throw new Error('Invalid TOTP code');
          }
        }

        return {
          id: user.id,
          username: user.username,
          totpEnabled: user.totpEnabled,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user: authUser }) {
      if (authUser) {
        token.username = authUser.username;
        token.totpEnabled = user.totpEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string;
        session.user.totpEnabled = token.totpEnabled as boolean;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
};

// Function to update user's password
export async function updatePassword(oldPassword: string, newPassword: string) {
  // Verify old password
  const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid current password');
  }

  // Hash and update new password
  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  return true;
}

// Function to enable TOTP
export function enableTOTP(secret: string) {
  user.totpSecret = secret;
  user.totpEnabled = true;
}

// Function to disable TOTP
export function disableTOTP() {
  user.totpSecret = null;
  user.totpEnabled = false;
}

// Function to get TOTP status
export function getTOTPStatus() {
  return {
    enabled: user.totpEnabled,
    secret: user.totpSecret,
  };
}