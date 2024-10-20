// app/protected/page.tsx
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, router]);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You are logged in!</p>
    </div>
  );
};

export default ProtectedPage;
