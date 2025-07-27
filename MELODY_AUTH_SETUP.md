# Melody Auth Setup Instructions

This project has been migrated from NextAuth.js to Melody-Auth for better social authentication support.

## Setup Steps

### 1. Deploy Melody-Auth Server

Choose one of these deployment options:

**Option A: Cloudflare Workers (Recommended)**
```bash
# Clone melody-auth repository
git clone https://github.com/ValueMelody/melody-auth.git
cd melody-auth/server

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Create Cloudflare resources (D1 database, KV storage, Worker)
# Follow instructions at: https://auth.valuemelody.com/auth-server-setup.html

# Configure wrangler.toml with your resource IDs
# Generate secrets and deploy
npm run prod:secret:generate
npm run prod:migration:apply
npm run prod:deploy
```

**Option B: Node.js with PostgreSQL/Redis**
```bash
# Clone and setup
git clone https://github.com/ValueMelody/melody-auth.git
cd melody-auth/server

# Configure environment
cp .dev.vars.example .dev.vars
# Fill in PostgreSQL and Redis connection strings

# Setup and start
npm run node:secret:generate
npm run node:migration:apply
npm run node:build
npm run node:start
```

### 2. Configure Social Providers

In your melody-auth server configuration, add:

```env
# Google OAuth
GOOGLE_AUTH_CLIENT_ID=your-google-client-id-here
GOOGLE_AUTH_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth  
GITHUB_AUTH_CLIENT_ID=your-github-client-id-here
GITHUB_AUTH_CLIENT_SECRET=your-github-client-secret-here
```

### 3. Create Application Registration

Using the melody-auth admin panel or API, create an application with:
- **Name**: EkoRental App
- **Type**: SPA (Single Page Application)
- **Redirect URIs**: `http://localhost:3000/auth/callback`, `https://yourdomain.com/auth/callback`
- **Post Logout URIs**: `http://localhost:3000/`, `https://yourdomain.com/`

### 4. Update Environment Variables

Update `.env.local` with your melody-auth server details:

```env
NEXT_PUBLIC_MELODY_CLIENT_ID=your-actual-client-id-from-step-3
NEXT_PUBLIC_MELODY_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_MELODY_SERVER_URI=https://your-melody-auth-server-url.com
```

### 5. Update OAuth Provider Settings

Make sure your Google and GitHub OAuth apps have the correct redirect URIs:

**Google Console**: Add `https://your-melody-auth-server-url.com/oauth2/v1/social/google/callback`
**GitHub Settings**: Add `https://your-melody-auth-server-url.com/oauth2/v1/social/github/callback`

## Benefits of Melody-Auth

- ✅ Robust social authentication (Google, GitHub, Facebook, Discord, Apple)
- ✅ Built-in email authentication with verification
- ✅ Multi-factor authentication (OTP, SMS, Email, Passkeys)
- ✅ Organization and user management
- ✅ Admin panel for configuration
- ✅ SAML SSO support
- ✅ Role-based access control
- ✅ Comprehensive audit logging

## Development

For local development, you can run melody-auth locally:

1. Follow the Node.js setup above
2. Set `NEXT_PUBLIC_MELODY_SERVER_URI=http://localhost:8787`
3. Ensure both melody-auth server and Next.js app are running

## Production Deployment

1. Deploy melody-auth server to Cloudflare Workers or your preferred platform
2. Update environment variables with production URLs
3. Configure OAuth providers with production callback URLs
4. Test authentication flow thoroughly

## Troubleshooting

- **CORS Issues**: Ensure melody-auth server allows your frontend domain
- **OAuth Errors**: Verify callback URLs match exactly in OAuth provider settings
- **Token Issues**: Check that client ID and server URI are correct
- **Network Issues**: Ensure melody-auth server is accessible from your frontend

For more detailed documentation: https://auth.valuemelody.com/