import { NextResponse } from 'next/server';

export async function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/github/callback`;

  if (!githubClientId) {
    console.error('GITHUB_CLIENT_ID is not defined');
    return NextResponse.redirect('/sign-in?error=github_config_error');
  }

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.append('client_id', githubClientId);
  githubAuthUrl.searchParams.append('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.append('scope', 'user:email');

  return NextResponse.redirect(githubAuthUrl.toString());
}
