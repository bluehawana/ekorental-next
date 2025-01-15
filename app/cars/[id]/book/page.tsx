'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  hourRate: number;
  licensePlate: string;
  location: string;
  imageUrl: string;
  description: string;
}

interface BookingDetails {
  pickupTime: string;
  returnTime: string;
  totalHours: number;
  totalPrice: number;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [booking, setBooking] = useState<BookingDetails>({
    pickupTime: '',
    returnTime: '',
    totalHours: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/cars/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch car');
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
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

  const getImageUrl = (url: string) => {
    return url?.endsWith('.jpg') ? url.replace('.jpg', '.png') : url;
  };

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
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
    if (!car || !booking.pickupTime || !booking.returnTime) return;

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
          pickupTime: booking.pickupTime,
          returnTime: booking.returnTime,
          totalHours: booking.totalHours,
          totalPrice: booking.totalPrice
        }),
      });

      if (!response.ok) throw new Error('Booking failed');
      
      const { sessionUrl } = await response.json();
      router.push(sessionUrl); // Redirect to Stripe checkout
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    }
  };

  if (!car) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto bg-white">
        <div className="relative w-full" style={{ paddingTop: '50%' }}>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-contain p-4"
            unoptimized
          />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-3">{car.make} {car.model}</h1>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="space-y-1">
                <p className="text-gray-600">Year: {car.year}</p>
                <p className="text-gray-600">Location: {car.location}</p>
                <p className="text-gray-600">License: {car.licensePlate}</p>
                <p className="text-gray-600">
                  <span>Price per hour: </span>
                  <span className="text-gray-900 font-semibold">{car.hourRate} SEK/h</span>
                </p>
              </div>
              <div>
              </div>
            </div>
            <p className="text-gray-700 mt-2">{car.description}</p>
          </div>

          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold">Book Your Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick-up Time
                </label>
                <input
                  type="datetime-local"
                  value={booking.pickupTime}
                  onChange={handlePickupChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  min={formatDateTime(new Date())}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Time
                </label>
                <input
                  type="datetime-local"
                  value={booking.returnTime}
                  onChange={handleReturnChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  min={booking.pickupTime || formatDateTime(new Date())}
                />
              </div>
            </div>

            {booking.totalHours > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Total Duration: {booking.totalHours} hours</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  Total Price: {booking.totalPrice} SEK
                </p>
              </div>
            )}

            <Button 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 text-lg"
              disabled={booking.totalHours <= 0}
              onClick={handleBooking}
            >
              Proceed to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
