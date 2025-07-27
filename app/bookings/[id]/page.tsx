'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Booking {
  id: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string;
  car?: {
    imageUrl?: string;
    make?: string;
    model?: string;
  };
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Booking not found</h2>
          <Link href="/bookings" className="text-blue-500 hover:underline mt-4 block">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
          
          <div className="mb-6">
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              <Image
                src={booking.car?.imageUrl || '/images/placeholder-car.png'}
                alt={`${booking.car?.make} ${booking.car?.model}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-car.png';
                }}
              />
            </div>
            {booking.car && (
              <h2 className="text-xl font-semibold">
                {booking.car.make} {booking.car.model}
              </h2>
            )}
          </div>

          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-semibold">{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold">{booking.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Start Time</p>
                <p className="font-semibold">{new Date(booking.startTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">End Time</p>
                <p className="font-semibold">{new Date(booking.endTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Price</p>
                <p className="font-semibold">{booking.totalPrice} SEK</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link 
              href="/bookings" 
              className="text-blue-500 hover:underline flex items-center"
            >
              ← Back to Bookings
            </Link>
            <Link
              href={`/cars/${booking.carId}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Car Details
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
} 