'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Car {
  id: number;
  model: string;
  licensePlate: string;
  hourRate: number;
  imageUrl: string;
  isAvailable: boolean;
  location: string;
  year: number;
  description: string;
}

interface BookingFormProps {
  carId: string;
}

const BookingForm = ({ carId }: BookingFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/cars/${carId}`);
        if (!response.ok) throw new Error('Failed to fetch car details');
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
        toast.error('Failed to load car details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.max(0, (endTime - startTime) / (1000 * 60 * 60));
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (newStartDate && newEndDate && car) {
      const hours = calculateDuration(newStartDate, newEndDate);
      setTotalHours(hours);
      setTotalPrice(hours * car.hourRate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!car || !session?.user) {
      toast.error('Please sign in to book a car');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const bookingData = {
        car: { id: car.id },
        user: { email: session.user.email },
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: totalPrice,
        status: "PENDING"
      };

      const response = await fetch('http://localhost:8085/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      const result = await response.json();
      toast.success('Booking successful!');
      router.push(`/bookings/confirmation?id=${result.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!car) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Car not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book {car.model}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative h-48 mb-4">
            <Image
              src={car.imageUrl}
              alt={car.model}
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Price per hour</p>
              <p>{car.hourRate} kr/hour</p>
            </div>
            <div>
              <p className="font-semibold">Location</p>
              <p>{car.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Pick-up Date and Time
            </label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Return Date and Time
            </label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              required
              min={startDate}
            />
          </div>

          {totalHours > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Duration:</span>
                <span>{totalHours} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-lg font-bold">{totalPrice} kr</span>
              </div>
            </div>
          )}

          <Button 
            type="submit"
            disabled={isSubmitting || !session || !car.isAvailable}
            className="w-full"
          >
            {isSubmitting 
              ? 'Processing...' 
              : !session 
                ? 'Sign in to Book' 
                : !car.isAvailable
                  ? 'Car Not Available'
                  : 'Confirm Booking'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
