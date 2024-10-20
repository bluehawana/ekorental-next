// src/app/admin-dashboard/page.tsx
'use client'

import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Add admin-specific content here */}
    </div>
  );
}