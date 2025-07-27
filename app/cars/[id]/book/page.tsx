'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { CarImage } from '@/components/cars/CarImage';
import Image from 'next/image';

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

interface BookingFormData {
  startDate: string;
  endDate: string;
  totalAmount: number;
}

export default function BookingPage() {
  const { data: session, status } = useSession();
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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=' + encodeURIComponent(window.location.href));
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      console.log('Logged in user ID:', session.user.id);
      console.log('Logged in user email:', session.user.email);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-gray-800 animate-pulse">
          <div className="aspect-video w-full bg-gray-700" />
          <CardContent className="p-6">
            <div className="h-8 bg-gray-700 rounded mb-4" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const calculatePrice = (start: string, end: string) => {
    if (!car || !start || !end) {
      return { hours: 0, price: 0 };
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInHours = Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    const hours = Math.ceil(diffInHours);
    const price = hours * (car.hourRate || 0);

    return { hours, price };
  };

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPickupTime = e.target.value;
    setBooking(prev => {
      const calculation = calculatePrice(newPickupTime, prev.returnTime);
      return {
        ...prev,
        pickupTime: newPickupTime,
        totalHours: calculation?.hours || 0,
        totalPrice: calculation?.price || 0
      };
    });
  };

  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReturnTime = e.target.value;
    setBooking(prev => {
      const calculation = calculatePrice(prev.pickupTime, newReturnTime);
      return {
        ...prev,
        returnTime: newReturnTime,
        totalHours: calculation?.hours || 0,
        totalPrice: calculation?.price || 0
      };
    });
  };

  const handleBooking = async () => {
    if (!session?.user) {
      toast.error('Please sign in to book a car');
      router.push('/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    // Check each required field individually and show specific error messages
    if (!booking.pickupTime) {
      toast.error('Please select a pickup time');
      return;
    }

    if (!booking.returnTime) {
      toast.error('Please select a return time');
      return;
    }

    // Validate that return time is after pickup time
    const pickupDate = new Date(booking.pickupTime);
    const returnDate = new Date(booking.returnTime);
    if (returnDate <= pickupDate) {
      toast.error('Return time must be after pickup time');
      return;
    }

    try {
      setIsSubmitting(true);

      const formatDateForBackend = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toISOString().replace('Z', '');
      };

      const startDate = formatDateForBackend(booking.pickupTime);
      const endDate = formatDateForBackend(booking.returnTime);

      const bookingData = {
        carId: car.id,
        userId: session.user.id,
        startDate,
        endDate,
        totalPrice: booking.totalPrice
      };

      console.log('Creating booking with data:', bookingData);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      console.log('Booking created successfully:', data);

      // Store complete booking data including car details
      const storedBooking = {
        ...data,
        car: {
          make: car.make,
          model: car.model,
          imageUrl: car.imageUrl
        },
        startDate: startDate,
        endDate: endDate,
        totalAmount: booking.totalPrice
      };

      console.log('Storing booking data:', storedBooking);
      localStorage.setItem('currentBooking', JSON.stringify(storedBooking));
      
      toast.success('Booking created! Redirecting to payment...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/bookings/${data.id}/payment`);

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/cars/default.webp'; // Fallback image
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`; // Adjust base URL as needed
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
        <div className="relative w-full" style={{ height: '400px' }}>
          <Image
            src={car?.imageUrl || '/cars/default.webp'}
            alt={`${car?.make} ${car?.model}`}
            fill
            className="object-contain p-4"
            priority
            unoptimized
            onError={() => setImageError(true)}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <p>Image not available</p>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {car?.make} {car?.model}
            </h1>
            <div className="flex items-center text-gray-400 space-x-4">
              <span>{car?.year}</span>
              <span>•</span>
              <span>{car?.location}</span>
              <span>•</span>
              <span>{car?.hourRate} SEK/hour</span>
            </div>
            <p className="mt-4 text-gray-300">{car?.description}</p>
          </div>

          <div className="space-y-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-white">Book Your Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-300">
                  Pickup Date and Time
                </label>
                <input
                  id="pickup"
                  type="datetime-local"
                  value={booking.pickupTime}
                  onChange={handlePickupChange}
                  min={formatDateTime(new Date())}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                    hover:border-gray-500 transition-colors [color-scheme:dark]"
                  style={{
                    colorScheme: 'dark',
                    backgroundColor: '#1a1b1e'
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Click to select date (YYYY-MM-DD) and time (HH:MM)
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="return" className="block text-sm font-medium text-gray-300">
                  Return Date and Time
                </label>
                <input
                  id="return"
                  type="datetime-local"
                  value={booking.returnTime}
                  onChange={handleReturnChange}
                  min={booking.pickupTime || formatDateTime(new Date())}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                    hover:border-gray-500 transition-colors [color-scheme:dark]"
                  style={{
                    colorScheme: 'dark',
                    backgroundColor: '#1a1b1e'
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Click to select date (YYYY-MM-DD) and time (HH:MM)
                </p>
              </div>
            </div>

            {booking.totalHours > 0 && (
              <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Duration:</span>
                  <span>{booking.totalHours} hours</span>
                </div>
                <div className="flex justify-between text-white font-semibold">
                  <span>Total Price:</span>
                  <span>{booking.totalPrice} SEK</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={
                isSubmitting || 
                !booking.pickupTime || 
                !booking.returnTime || 
                new Date(booking.returnTime) <= new Date(booking.pickupTime)
              }
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Book Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
