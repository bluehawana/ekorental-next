import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in?error=invalid_token', request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Here you would typically create a session for the user
    console.log('User verified:', decoded);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/sign-in?error=invalid_token', request.url));
  }
}
