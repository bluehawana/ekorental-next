import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:8080';

interface PaymentProps {
  bookingId: string;
  amount: number;
}

export function Payment({ bookingId, amount }: PaymentProps) {
  const handlePayment = async () => {
    try {
      console.log('Creating payment session for booking:', bookingId, 'amount:', amount);
      const response = await fetch(`${BACKEND_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount: Math.round(amount * 100), // Convert to cents for Stripe
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Payment session creation failed:', errorData);
        throw new Error(errorData.message || 'Failed to create payment session');
      }

      const { url } = await response.json();
      console.log('Redirecting to Stripe URL:', url);
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      Proceed to Payment
    </button>
  );
} 