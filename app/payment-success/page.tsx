'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';

interface Car {
  id: number;
  make: string;
  model: string;
  year: string;
  image: string;
  location: string;
  hourRate: number;
  available: boolean;
}

interface BookingDetails {
  id: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  carModel: string;
  carImage: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('booking_id');
    if (!bookingId) {
      toast.error('No booking ID provided');
      return;
    }

    const updateBookingStatus = async () => {
      try {
        // Update booking status to CONFIRMED
        const updateResponse = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'CONFIRMED' }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update booking status');
        }

        console.log('Successfully updated booking status to CONFIRMED');
      } catch (error) {
        console.error('Error updating booking status:', error);
        toast.error('Failed to update booking status');
      }
    };

    const fetchBookingDetails = async () => {
      try {
        await updateBookingStatus(); // First update the status
        
        // Then fetch the updated booking details
        const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        
        const data = await response.json();
        console.log('Received booking data:', data);
        setBooking(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-car.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Thank you for your booking</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
            {booking.carImage && (
              <div className="mb-4">
                <Image
                  src={getImageUrl(booking.carImage)}
                  alt={booking.carModel || 'Car'}
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2 text-gray-300">
              <p>Model: {booking.carModel}</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Booking Information</h2>
            <div className="space-y-3 text-gray-300">
              <p>Booking ID: {booking.id}</p>
              <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
              <p>Total Price: {booking.totalPrice} SEK</p>
              <p>Status: {booking.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 