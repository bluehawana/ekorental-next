import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Save or update user in your database
        const response = await fetch('http://localhost:8085/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account.provider,
            providerId: profile.sub || profile.id,
          }),
        });

        if (!response.ok) {
          console.error('Failed to save user');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error saving user:', error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile?.sub || profile?.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect to dashboard
      if (url === baseUrl || url === '/') {
        return `${baseUrl}/dashboard`
      }
      // For specific callback URLs (like booking pages), keep them
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    },
  },
  pages: {
    signIn: '/(auth)/signin',
    error: '/(auth)/error',
    signOut: '/',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }