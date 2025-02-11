'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Payment } from '@/components/Payment';

interface BookingDetails {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bookingId = searchParams.get('id');

  useEffect(() => {
    let isMounted = true;

    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`);
        
        if (!isMounted) return;

        if (response.status === 404) {
          setError('Booking not found');
          toast.error('Booking not found');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        
        const data = await response.json();
        setBooking(data);
        toast.success('Booking details loaded');
      } catch (error) {
        if (!isMounted) return;
        setError('Failed to load booking details');
        toast.error('Failed to load booking details');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Booking</h1>
          <p className="text-gray-300 mb-6">No booking ID was provided.</p>
          <Link 
            href="/dashboard"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-block w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Booking Details</h1>
          <p className="text-lg text-gray-300">Booking ID: {booking.id}</p>
        </div>

        <div className="space-y-6">
          <div className="border-t border-b border-gray-700 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Pick-up Time</p>
                <p className="text-lg font-medium text-white">{formatDate(booking.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Return Time</p>
                <p className="text-lg font-medium text-white">{formatDate(booking.endDate)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Price</p>
            <p className="text-2xl font-bold text-white">{booking.totalPrice} SEK</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-lg font-medium text-blue-400">{booking.status}</p>
          </div>

          {booking.status === 'PENDING' && (
            <div className="mt-6 flex justify-center">
              <Payment bookingId={booking.id.toString()} amount={booking.totalPrice} />
            </div>
          )}

          <div className="flex flex-col gap-4 mt-8 items-center">
            {booking.status === 'PENDING' && (
              <Link
                href="/dashboard"
                className="inline-flex justify-center items-center px-6 py-3 border border-gray-600 text-base font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 transition-colors w-96"
              >
                Return to Dashboard
              </Link>
            )}
            <Link
              href="/bookings"
              className="inline-flex justify-center items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors w-96"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 