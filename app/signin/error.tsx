'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null;
} 