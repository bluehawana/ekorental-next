import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // TODO: Exchange code for tokens and get user email
    const userEmail = 'bluehawana@example.com'; // Replace with actual email from GitHub

    cookies().set('auth_method', 'github');
    cookies().set('user_email', userEmail);
    
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } else {
    return NextResponse.redirect(new URL('/sign-in?error=github_auth_failed', request.url));
  }
}
