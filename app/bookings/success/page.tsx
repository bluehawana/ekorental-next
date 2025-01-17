'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Booking {
  id: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
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
        console.log('Attempting to fetch booking:', bookingId);
        const response = await fetch(`/api/bookings/${bookingId}`);
        console.log('Response status:', response.status);
        
        if (!isMounted) return;

        if (response.status === 404) {
          console.log('Booking not found');
          setError('Booking not found');
          toast.error('Booking not found', { id: 'booking-error' });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        
        const data = await response.json();
        console.log('Received booking data:', data);
        setBooking(data);
        toast.success('Booking confirmed!', { id: 'booking-success' });
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details');
        toast.error('Failed to load booking details', { id: 'booking-error' });
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

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-gray-800 text-white text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Booking</h1>
          <p className="text-gray-300 mb-6">No booking ID was provided.</p>
          <Link 
            href="/dashboard"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-gray-800">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-gray-800 text-white text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-gray-800 text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-green-500">Booking Confirmed!</h1>
          
          {booking ? (
            <div className="mt-6 space-y-2 text-gray-300">
              <p>Booking ID: {booking.id}</p>
              <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
              <p>Total Price: {booking.totalPrice} SEK</p>
              <p>Status: {booking.status}</p>
            </div>
          ) : (
            <p className="text-gray-300">Booking details not available.</p>
          )}

          <div className="mt-8 space-y-4">
            <Link 
              href="/dashboard"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
            <Link 
              href="/bookings"
              className="block w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 