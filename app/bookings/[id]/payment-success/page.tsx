'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const params = useParams();
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const updateBookingStatus = async () => {
      try {
        console.log('Attempting to update booking status for ID:', params.id);
        
        const response = await fetch(`/api/bookings/${params.id}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Update response status:', response.status);
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error data:', data);
          throw new Error(data.error || 'Failed to update booking status');
        }

        console.log('Booking updated successfully:', data);
        toast.success('Payment successful! Booking confirmed.');
      } catch (error) {
        console.error('Error updating booking:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update booking status');
      } finally {
        setIsUpdating(false);
      }
    };

    if (params.id) {
      updateBookingStatus();
    }
  }, [params.id]);

  if (isUpdating) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-md mx-auto bg-gray-800">
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-md mx-auto bg-gray-800 text-white">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-green-500 mb-6">Payment Successful!</h1>
          <p className="text-gray-300 mb-6">
            Your booking has been confirmed. A confirmation email has been sent to your inbox.
          </p>

          <div className="space-y-4">
            <Link 
              href={`/bookings/${params.id}`}
              className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              View Booking Details
            </Link>
            <Link 
              href="/dashboard"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 