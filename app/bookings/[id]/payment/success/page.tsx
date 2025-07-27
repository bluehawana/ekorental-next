'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function PaymentSuccessPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmBooking = async () => {
      if (!params.id) {
        setError('Invalid booking ID');
        return;
      }

      try {
        console.log('Confirming booking with session:', session);
        const response = await fetch(`/api/bookings/${params.id}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Confirmation failed:', data);
          throw new Error(data.error || 'Failed to confirm booking');
        }

        console.log('Booking confirmed:', data);
        toast.success('Booking confirmed successfully!');
        
        // Clear any stored booking data
        localStorage.removeItem('currentBooking');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push('/bookings');
      } catch (error) {
        console.error('Confirmation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to confirm booking';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsConfirming(false);
      }
    };

    if (session?.user) {
      confirmBooking();
    } else {
      router.push('/signin');
    }
  }, [params.id, session, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-gray-800">
        <CardContent className="p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Confirmation Failed' : 'Payment Successful!'}
          </h1>
          {isConfirming ? (
            <div className="space-y-4">
              <p className="text-gray-300">Confirming your booking...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto" />
            </div>
          ) : (
            <div className="space-y-4">
              {error ? (
                <>
                  <p className="text-red-400">{error}</p>
                  <p className="text-gray-300">
                    Please contact support for assistance.
                  </p>
                  <Button
                    onClick={() => router.push('/support')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Contact Support
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-300">
                    Your booking has been confirmed. Redirecting to your bookings...
                  </p>
                  <Button
                    onClick={() => router.push('/bookings')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View My Bookings
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 