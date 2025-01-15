import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getGoogleUserInfo(access_token: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // TODO: Exchange code for tokens
    // This is a placeholder. You should implement the actual token exchange.
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      const userInfo = await getGoogleUserInfo(tokenData.access_token);

      cookies().set('auth_method', 'google');
      cookies().set('user_email', userInfo.email);
      cookies().set('user_name', userInfo.name);
      cookies().set('user_avatar', userInfo.picture);
      
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.redirect(new URL('/sign-in?error=google_auth_failed', request.url));
}
