'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { MapPin, Calendar, Clock, CheckCircle, Car } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8080';

interface Car {
  id: number;
  make: string;
  model: string;
  location: string;
  imageUrl?: string;
  pricePerHour: number;
}

interface BookingDetails {
  id: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  car?: Car;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('id');
    
    if (!bookingId) {
      toast.error('No booking ID provided');
      router.push('/dashboard');
      return;
    }

    const fetchBookingAndCarDetails = async () => {
      try {
        // Fetch booking details
        const bookingResponse = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`);
        if (!bookingResponse.ok) throw new Error('Failed to fetch booking details');
        const bookingData = await bookingResponse.json();

        // If booking is not in PENDING status, redirect to dashboard
        if (bookingData.status !== 'PENDING') {
          router.push('/dashboard');
          return;
        }

        // Fetch car details
        const carResponse = await fetch(`${BACKEND_URL}/api/cars/${bookingData.carId}`);
        if (!carResponse.ok) throw new Error('Failed to fetch car details');
        const carData = await carResponse.json();

        // Combine booking and car data
        const completeBooking = {
          ...bookingData,
          car: carData
        };
        
        // Set the combined data
        setBooking(completeBooking);

        // Update booking status to CONFIRMED
        try {
          const updateResponse = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'CONFIRMED' }),
          });
          
          if (updateResponse.ok) {
            setBooking(prev => prev ? { ...prev, status: 'CONFIRMED' } : null);
            toast.success('Booking confirmed successfully!');
          } else {
            console.warn('Failed to update booking status');
            toast.error('Failed to update booking status');
          }
        } catch (updateError) {
          console.error('Error updating booking status:', updateError);
          toast.error('Failed to update booking status');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndCarDetails();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking || !booking.car) {
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

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-center mb-8">
              <CheckCircle className="text-green-500 w-16 h-16" />
              <h1 className="text-3xl font-bold text-white ml-4">Booking Confirmed!</h1>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Car Details</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center justify-center w-full md:w-1/2 h-48 rounded-lg bg-gray-800">
                  {booking.car.imageUrl ? (
                    <img
                      src={`${BACKEND_URL}${booking.car.imageUrl}`}
                      alt={`${booking.car.make} ${booking.car.model}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  ) : (
                    <Car className="w-24 h-24 text-blue-500" />
                  )}
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-white">
                    {booking.car.make} {booking.car.model}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{booking.car.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Pickup: {formatDate(booking.startTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>Return: {formatDate(booking.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Important Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Please arrive 15 minutes before your pickup time</li>
                <li>Bring your driver's license and booking confirmation</li>
                <li>The car will be fully fueled - please return it with a full tank</li>
                <li>Check the car for any damage before driving</li>
                <li>In case of emergency, call our 24/7 support: +46 XXX XXX XXX</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href={`/bookings/${booking.id}`}
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Booking Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 