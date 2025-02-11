'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [status, setStatus] = useState('Processing...');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (sessionId && bookingId) {
      // Update booking status
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then(() => {
          setStatus('Payment successful! Your booking is confirmed.');
        })
        .catch((error) => {
          console.error('Error confirming booking:', error);
          setStatus('There was an error confirming your booking. Please contact support.');
        });
    }
  }, [sessionId, bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Booking Status</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
} 