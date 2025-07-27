'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CheckCircle, CreditCard } from 'lucide-react';

interface Booking {
  id: string;
  carId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

export default function SuccessPage() {
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
        const response = await fetch(`/api/bookings/${bookingId}`);
        
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
        toast.success('Booking confirmed!');
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

  const handlePayment = async () => {
    if (!booking) return;
    
    try {
      const response = await fetch(`/api/bookings/${booking.id}/payment`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to process payment');
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
        <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
          <CardHeader className="flex flex-col items-center space-y-6 px-6 py-12">
            <CardTitle className="text-2xl font-bold">Invalid Booking</CardTitle>
            <p className="text-gray-400">No booking ID was provided.</p>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <Link href="/dashboard">
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 h-12 text-base"
                variant="secondary"
              >
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
        <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
        <Card className="w-[380px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
          <CardHeader className="flex flex-col items-center space-y-6 px-6 py-12">
            <CardTitle className="text-2xl font-bold text-red-500">Error</CardTitle>
            <p className="text-gray-400">{error}</p>
          </CardHeader>
          <CardContent className="px-6 pb-8 space-y-4">
            <Link href="/dashboard">
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 h-12 text-base"
                variant="secondary"
              >
                Return to Dashboard
              </Button>
            </Link>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#2A2A4A] hover:bg-[#3A3A5A] text-white h-12 text-base"
              variant="secondary"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] flex items-center justify-center p-4">
      <Card className="w-[475px] bg-[#1C1C3A] border-0 text-white shadow-2xl">
        <CardHeader className="flex flex-col items-center space-y-6 px-8 pt-12">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">Booking Confirmed!</CardTitle>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {booking ? (
            <div className="mb-8 space-y-4 bg-[#2A2A4A] rounded-lg p-6">
              <p className="text-gray-300 text-lg">
                <span className="font-semibold">Booking ID:</span> {booking.id}
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-semibold">Start:</span> {new Date(booking.startTime).toLocaleString()}
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-semibold">End:</span> {new Date(booking.endTime).toLocaleString()}
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-semibold">Total:</span> {booking.totalPrice.toFixed(2)} SEK
              </p>
              <p className="text-gray-300 text-lg">
                <span className="font-semibold">Status:</span>{' '}
                <span className={booking.status === 'PENDING' ? 'text-yellow-500' : 'text-green-500'}>
                  {booking.status}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 mb-8 text-center text-lg">Booking details not available.</p>
          )}

          <div className="space-y-4">
            <Button 
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg flex items-center justify-center gap-3"
            >
              <CreditCard className="w-6 h-6" />
              Proceed to Payment
            </Button>
            
            <Link href="/dashboard">
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 h-14 text-lg"
                variant="secondary"
              >
                Return to Dashboard
              </Button>
            </Link>
            
            <Link href="/bookings">
              <Button 
                className="w-full bg-[#2A2A4A] hover:bg-[#3A3A5A] text-white h-14 text-lg"
                variant="secondary"
              >
                View My Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 