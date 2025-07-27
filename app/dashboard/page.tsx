'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/signin');
    },
  });

  useEffect(() => {
    console.log('Dashboard Session:', {
      status,
      session: session,
      isAuthenticated: status === 'authenticated'
    });
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome {session?.user?.name || session?.user?.email}</h1>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Session Details</h2>
        <pre className="bg-white p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}