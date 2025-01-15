'use client';

import { useEffect } from 'react';
import { useAdminCheck } from '@/lib/hooks/useAdminCheck';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminCheck();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');  // Redirect if the user is not an admin
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading state while checking admin status
  }

  if (!isAdmin) {
    return null;  // Optionally render nothing until redirect occurs
  }

  return (
      <div>
        <h1>Admin Dashboard</h1>
        {/* Add admin-specific content here */}
      </div>
  );
}
