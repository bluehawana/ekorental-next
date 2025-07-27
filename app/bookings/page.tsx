'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface Car {
  id: number;
  brand: string;
  model: string;
  image: string | null;
  pricePerHour: number;
}

interface Booking {
  id: number;
  userId: number;
  carId: number;
  startTime: string;
  endTime: string;
  totalPrice: string;
  status: string;
  car?: Car;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log('Current session user ID:', session?.user?.id);
        const response = await fetch('/api/bookings/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error fetching bookings:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            userId: session?.user?.id
          });
          throw new Error(errorText || 'Failed to fetch bookings');
        }

        const data = await response.json();
        console.log(`Received ${data.length} bookings for user ${session?.user?.id}`);
        setBookings(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load bookings';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.id) {
      fetchBookings();
    }
  }, [status, session?.user?.id, router]);

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('Delete response:', {
        status: response.status,
        text: responseText
      });

      if (!response.ok) {
        throw new Error(responseText || 'Failed to cancel booking');
      }

      // Remove the booking from the list
      setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const message = error instanceof Error ? error.message : 'Failed to cancel booking';
      toast.error(message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-[#1C1C3A] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-[#1C1C3A] border-0 text-white">
            <CardContent className="p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <User className="w-5 h-5" />
            <span>{session?.user?.email}</span>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <Card className="bg-[#1C1C3A] border-0 text-white">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400 mb-4">You haven't made any bookings yet.</p>
              <Link href="/">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Browse Cars
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-[#1C1C3A] border-0 text-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-32 relative">
                      <img
                        src={getCarImage(booking.carId)}
                        alt={getCarModelName(booking.carId)}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">
                          {getCarModelName(booking.carId)}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                          booking.status === 'PAID' ? 'bg-green-500/20 text-green-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Pick-up Time
                          </label>
                          <input
                            type="datetime-local"
                            value={booking.pickupTime}
                            onChange={handlePickupChange}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md 
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white 
                              [color-scheme:light] hover:border-gray-400 transition-colors"
                            min={formatDateTime(new Date())}
                            suppressHydrationWarning
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Return Time
                          </label>
                          <input
                            type="datetime-local"
                            value={booking.returnTime}
                            onChange={handleReturnChange}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md 
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white 
                              [color-scheme:light] hover:border-gray-400 transition-colors"
                            min={booking.pickupTime || formatDateTime(new Date())}
                            suppressHydrationWarning
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="text-lg font-semibold">{booking.totalPrice} SEK</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <Link href={`/bookings/${booking.id}/edit`}>
                                <Button 
                                  variant="outline" 
                                  className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border-blue-500/20"
                                >
                                  Edit
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border-red-500/20"
                                onClick={() => handleDeleteBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                              <Link href={`/bookings/success?id=${booking.id}`}>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                  Complete Payment
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getCarModelName(carId: number): string {
  const carModels: Record<number, string> = {
    1: 'Model 3',
    2: 'Model Y',
    3: 'Model S',
    4: 'Model X',
    5: 'Cybertruck',
    6: 'Roadster'
  };
  
  return `Tesla ${carModels[carId] || 'Unknown Model'}`;
}

function getCarImage(carId: number): string {
  const carImages: Record<number, string> = {
    1: '/cars/model-3.webp',
    2: '/cars/model-y.webp',
    3: '/cars/model-s.webp',
    4: '/cars/model-x.webp',
    5: '/cars/cybertruck.webp',
    6: '/cars/roadster.webp'
  };
  
  return carImages[carId] || '/cars/default.webp';
} 