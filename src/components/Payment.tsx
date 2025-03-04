'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PaymentProps {
  bookingId: string;
  amount: number;
}

export function Payment({ bookingId, amount }: PaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      console.log('Creating checkout session for:', { bookingId, amount });
      
      const response = await fetch('http://localhost:8080/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: Math.round(amount * 100) // Convert to cents for Stripe
        }),
        credentials: 'include' // Include cookies if you're using session-based auth
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Payment session creation failed');
      }

      if (data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from the server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : 'Proceed to Payment'}
    </button>
  );
} 