'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  hourRate: number;
  imageUrl: string;
  description: string;
  location: string;
}

interface BookingDetails {
  pickupTime: string;
  returnTime: string;
  totalHours: number;
  totalPrice: number;
}

export default function BookingPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingDetails>({
    pickupTime: '',
    returnTime: '',
    totalHours: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/cars/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch car');
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load car details');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  const calculatePrice = (pickup: string, returnTime: string) => {
    if (!pickup || !returnTime || !car) return;
    
    const start = new Date(pickup);
    const end = new Date(returnTime);
    const diffHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    setBooking({
      pickupTime: pickup,
      returnTime: returnTime,
      totalHours: diffHours,
      totalPrice: diffHours * car.hourRate
    });
  };

  const formatDateTime = (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPickup = e.target.value;
    setBooking(prev => ({
      ...prev,
      pickupTime: newPickup
    }));
    if (booking.returnTime) {
      calculatePrice(newPickup, booking.returnTime);
    }
  };

  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReturn = e.target.value;
    setBooking(prev => ({
      ...prev,
      returnTime: newReturn
    }));
    if (booking.pickupTime) {
      calculatePrice(booking.pickupTime, newReturn);
    }
  };

  const handleBooking = async () => {
    if (!car || !booking.pickupTime || !booking.returnTime || isSubmitting) return;
    
    if (!session?.user?.id) {
      toast.error('Please sign in to book a car');
      router.push('/signin');
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('Session user ID:', session.user.id);

      const bookingRequest = {
        id: null,
        userId: parseInt(session.user.id),
        carId: car.id,
        startTime: new Date(booking.pickupTime).toISOString(),
        endTime: new Date(booking.returnTime).toISOString(),
        status: "PENDING",
        totalPrice: booking.totalPrice.toFixed(2)
      };

      console.log('Sending booking request:', bookingRequest);

      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      const data = await response.json();
      console.log('Booking creation response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      const bookingId = data.id;
      if (bookingId) {
        console.log('Redirecting to success with ID:', bookingId);
        toast.success('Booking confirmed!');
        router.push(`/bookings/success?id=${bookingId}`);
      } else {
        console.error('No booking ID in response:', data);
        toast.error('Booking created but could not be retrieved');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse bg-gray-800 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <div className="relative w-full" style={{ paddingTop: '50%' }}>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover rounded-t-lg"
            onError={(e: any) => {
              e.target.src = '/placeholder-car.png';
            }}
            unoptimized
          />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {car.make} {car.model}
            </h1>
            <div className="flex items-center text-gray-400 space-x-4">
              <span>{car.year}</span>
              <span>•</span>
              <span>{car.location}</span>
              <span>•</span>
              <span>{car.hourRate} SEK/hour</span>
            </div>
            <p className="mt-4 text-gray-300">{car.description}</p>
          </div>

          <div className="space-y-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-white">Book Your Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pick-up Time
                </label>
                <input
                  type="datetime-local"
                  value={booking.pickupTime}
                  onChange={handlePickupChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white [color-scheme:dark]"
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
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white [color-scheme:dark]"
                  min={booking.pickupTime || formatDateTime(new Date())}
                  suppressHydrationWarning
                />
              </div>
            </div>

            {booking.totalHours > 0 && (
              <div className="bg-gray-700 p-4 rounded-lg" suppressHydrationWarning>
                <p className="text-gray-300">Total Duration: {booking.totalHours} hours</p>
                <p className="text-2xl font-bold text-white mt-2" suppressHydrationWarning>
                  Total Price: {booking.totalPrice} SEK
                </p>
              </div>
            )}

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              disabled={booking.totalHours <= 0 || isSubmitting}
              onClick={handleBooking}
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
