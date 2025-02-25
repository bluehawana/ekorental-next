'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';

// Make sure to use the correct publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentProps {
  bookingId: string;
  amount: number;
}

export function Payment({ bookingId, amount }: PaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      console.log('Creating checkout session for:', { bookingId, amount });
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
        }),
      });

      const data = await response.json();
      console.log('Checkout session response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Detailed payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
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