'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

interface BookingDetails {
  id: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  car: {
    id: number;
    make: string;
    model: string;
    year: string;
    imageUrl: string;
    location: string;
  };
}

export default function BookingSuccessPage() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

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
                <div className="relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden">
                  <Image
                    src={booking.car.imageUrl || '/placeholder-car.jpg'}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold text-white">
                    {booking.car.make} {booking.car.model} {booking.car.year}
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