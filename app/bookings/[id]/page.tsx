'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';
import { use } from 'react';

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  car?: {
    model: string;
    licensePlate: string;
  };
}

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailsPage({ params }: BookingPageProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/bookings/${resolvedParams.id}`);
        const data = await response.json();
        console.log('Received booking data:', data);

        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }

        // Transform the data to ensure correct field names
        const transformedBooking = {
          ...data,
          startTime: data.startTime || data.start_time,
          endTime: data.endTime || data.end_time,
        };

        console.log('Transformed booking:', transformedBooking);
        setBooking(transformedBooking);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [resolvedParams.id]);

  const formatDate = (dateString: string) => {
    if (!dateString) {
      console.error('Empty date string received');
      return 'Not set';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      
      return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-gray-800">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-gray-800">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Booking Not Found</h1>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Booking Details</h1>
              <Button
                className="bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 text-gray-300">
                <p>Booking ID: {booking.id}</p>
                <p>Pick-up Time: {formatDate(booking.startTime)}</p>
                <p>Return Time: {formatDate(booking.endTime)}</p>
                <p>Total Price: {booking.totalPrice} SEK</p>
                <p>Status: <span className={`${
                  booking.status === 'CONFIRMED' ? 'text-green-400' : 
                  booking.status === 'PENDING' ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>{booking.status}</span></p>
                {booking.car && (
                  <>
                    <p>Car Model: {booking.car.model}</p>
                    <p>License Plate: {booking.car.licensePlate}</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                onClick={() => router.push('/dashboard')}
              >
                Return to Dashboard
              </Button>
              {booking.status === 'PENDING' && (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                  onClick={() => {/* Add cancel booking handler */}}
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 