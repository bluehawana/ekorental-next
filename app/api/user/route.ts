import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const authMethod = cookieStore.get('auth_method')?.value;
  const userEmail = cookieStore.get('user_email')?.value;
  const userName = cookieStore.get('user_name')?.value;
  const userAvatar = cookieStore.get('user_avatar')?.value;

  let user;

  switch (authMethod) {
    case 'github':
      user = {
        name: userName || 'GitHub User',
        email: userEmail,
        avatar: userAvatar || `https://github.com/${userName}.png`,
      };
      break;
    case 'google':
      user = {
        name: userName || userEmail?.split('@')[0] || 'Google User',
        email: userEmail,
        avatar: userAvatar || `https://lh3.googleusercontent.com/a/default-user=s120-c`,
      };
      break;
    case 'email':
      user = {
        name: userName || userEmail?.split('@')[0] || 'Email User',
        email: userEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userEmail?.split('@')[0] || 'User'
        )}&background=random`,
      };
      break;
    default:
      user = null;
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

