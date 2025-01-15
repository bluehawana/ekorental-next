'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Here you can verify the payment and update your database
    if (sessionId) {
      // Verify payment status with your backend
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your booking. You will receive a confirmation email shortly.
        </p>
      </Card>
    </div>
  );
} 