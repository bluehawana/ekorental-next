// lib/auth-config.ts
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;

      try {
        const response = await fetch('http://localhost:8080/api/users/oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account?.provider?.toUpperCase() || 'GOOGLE',
            avatarUrl: user.image,
            role: 'USER'
          }),
        });

        // Check for network errors
        if (!response) {
          console.error('Network error');
          return '/auth/error?error=network';
        }

        // Handle non-200 responses
        if (!response.ok) {
          console.error('Backend error:', response.status);
          return `/auth/error?error=${response.status}`;
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return '/auth/error?error=' + encodeURIComponent(error.message);
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  debug: true,
}