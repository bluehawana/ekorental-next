'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Booking {
  id: number;
  carId: number;
  startDate: string | null;
  endDate: string | null;
  totalAmount: number;
  status: string;
  car?: {
    make: string;
    model: string;
    imageUrl: string;
  };
}

export default function PaymentPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    
    try {
      // Clean up the date string and ensure it's in a consistent format
      const cleanDateString = dateString.trim().replace('Z', '');
      
      const date = new Date(cleanDateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
      }

      // Use UTC to ensure consistent formatting between server and client
      return new Intl.DateTimeFormat('en-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      if (!params.id) return;
      
      try {
        // Get stored booking data
        const storedData = localStorage.getItem('currentBooking');
        let storedBooking = null;
        
        if (storedData) {
          storedBooking = JSON.parse(storedData);
          console.log('Found stored booking:', storedBooking);
          
          if (storedBooking.id.toString() === params.id) {
            const bookingData = {
              ...storedBooking,
              startDate: storedBooking.startDate,
              endDate: storedBooking.endDate,
              totalAmount: storedBooking.totalAmount || storedBooking.totalPrice,
              car: {
                make: storedBooking.car?.make || '',
                model: storedBooking.car?.model || '',
                imageUrl: storedBooking.car?.imageUrl || ''
              }
            };
            setBooking(bookingData);
            setIsLoading(false);
            return; // Return early to prevent API fetch
          }
        }

        // Only fetch from API if no valid localStorage data
        const response = await fetch(`/api/bookings/${params.id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Booking fetch error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch booking');
        }
        
        const data = await response.json();
        console.log('Received booking data:', data);
        
        // Merge API data with stored data
        const transformedBooking = {
          ...data,
          startDate: storedBooking?.startDate || data.startDate,
          endDate: storedBooking?.endDate || data.endDate,
          totalAmount: data.totalAmount || data.totalPrice,
          car: storedBooking?.car || data.car || {
            make: '',
            model: '',
            imageUrl: ''
          }
        };
        
        console.log('Setting transformed booking:', transformedBooking);
        setBooking(transformedBooking);

      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  const handlePayment = async () => {
    if (!booking) return;

    try {
      setIsProcessing(true);
      console.log('Processing payment for booking:', booking);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.totalAmount,
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.sessionUrl) {
        // Only clear localStorage after successful payment
        localStorage.removeItem('currentBooking');
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session) {
    router.push('/signin');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-gray-800">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-gray-800">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl text-white">Booking not found</h1>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Complete Your Booking</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
              <h2 className="text-lg font-semibold text-white mb-4">Booking Summary</h2>
              
              {booking.car && (
                <div className="flex justify-between text-gray-300">
                  <span>Vehicle:</span>
                  <span>{booking.car.make} {booking.car.model}</span>
                </div>
              )}
              
              <div className="flex justify-between text-gray-300">
                <span>Start Time:</span>
                <span>{formatDate(booking.startDate)}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>End Time:</span>
                <span>{formatDate(booking.endDate)}</span>
              </div>
              
              <div className="flex justify-between text-white font-semibold mt-4">
                <span>Total Amount:</span>
                <span>{booking.totalAmount?.toFixed(2) || 0} SEK</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessing || !booking.totalAmount}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 