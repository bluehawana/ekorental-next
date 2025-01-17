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

        if (!response.ok) {
          return false;
        }

        const userData = await response.json();
        user.id = userData.id;

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful sign in
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
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