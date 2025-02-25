'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Payment } from '@/components/Payment';

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  car: {
    make: string;
    model: string;
    location: string;
  };
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
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
        // First fetch the booking
        const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`);
        
        if (!isMounted) return;

        if (bookingResponse.status === 404) {
          setError('Booking not found');
          toast.error('Booking not found');
          return;
        }

        if (!bookingResponse.ok) {
          throw new Error('Failed to fetch booking');
        }
        
        const bookingData = await bookingResponse.json();

        // Then fetch the car details
        const carResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cars/${bookingData.carId}`);
        if (!carResponse.ok) {
          throw new Error('Failed to fetch car details');
        }
        const carData = await carResponse.json();

        // Combine the data
        const completeBooking = {
          ...bookingData,
          car: {
            make: carData.make,
            model: carData.model,
            location: carData.location
          }
        };

        console.log('Complete booking data:', completeBooking);
        setBooking(completeBooking);
        toast.success('Booking details loaded');
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching data:', error);
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
    <div className="min-h-screen bg-gray-900">
      <div 
        className="container mx-auto px-4 pb-12" 
        style={{ paddingTop: '200px' }}
      >
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="text-center mb-8 mt-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">Booking Details</h1>
              <p className="text-base text-gray-400">Booking ID: {booking.id}</p>
            </div>

            <div className="space-y-6">
              <div className="border-t border-b border-gray-700 py-6">
                <div className="grid grid-cols-2 gap-8 px-8">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-400">Start Time</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(booking.startTime).toLocaleString('sv-SE')}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-400">End Time</p>
                    <p className="text-lg font-semibold text-white">
                      {new Date(booking.endTime).toLocaleString('sv-SE')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex flex-col space-y-2 px-8">
                  <p className="text-sm font-medium text-gray-400">Pick-up Location</p>
                  <p className="text-lg font-semibold text-white">
                    {booking.car?.location || 'Location not available'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex flex-col space-y-2 px-8">
                    <p className="text-sm font-medium text-gray-400">Total Price</p>
                    <p className="text-xl font-bold text-white">{booking.totalPrice} SEK</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex flex-col space-y-2 px-8">
                    <p className="text-sm font-medium text-gray-400">Status</p>
                    <p className="text-lg font-semibold text-blue-400">{booking.status}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                {booking.status === 'PENDING' && (
                  <div className="flex justify-center">
                    <Payment bookingId={booking.id.toString()} amount={booking.totalPrice} />
                  </div>
                )}
                
                <Link
                  href="/dashboard"
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-6 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg text-center"
                >
                  Return to Dashboard
                </Link>
                
                <Link
                  href={`/bookings?id=${booking.id}`}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg text-center"
                >
                  View and Editing My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 