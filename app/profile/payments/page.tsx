'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

const BACKEND_URL = 'http://localhost:8080';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/payments/history`);
        if (!response.ok) throw new Error('Failed to fetch payment history');
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p>No payment history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-semibold">
                  Booking #{payment.bookingId}
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(payment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-gray-400 text-sm">
                  Method: {payment.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {payment.amount.toFixed(2)} SEK
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    payment.status === 'succeeded'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 