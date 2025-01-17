'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Car {
  id: number;
  model: string;
  licensePlate: string;
  hourRate: number;
  location: string;
  isAvailable: boolean;
}

interface BookingFormProps {
  car: Car;
}

export function BookingForm({ car }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculatePrice = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInHours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
      setTotalHours(Math.round(diffInHours));
      setTotalPrice(Math.round(diffInHours * car.hourRate));
    }
  };

  const handleDateChange = () => {
    calculatePrice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please sign in to book a car');
      router.push('/signin');
      return;
    }

    if (!car.isAvailable) {
      toast.error('This car is not available for booking');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          carId: car.id,
          startTime: startDate,
          endTime: endDate,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create booking');
      }

      const booking = await response.json();
      toast.success('Booking created successfully!');
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create booking');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Book Your Rental</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleDateChange();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Return Time</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleDateChange();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min={startDate}
            />
          </div>
        </div>

        {totalHours > 0 && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <p className="text-sm text-gray-600">Duration: {totalHours} hours</p>
            <p className="text-sm text-gray-600">Rate: {car.hourRate} SEK/hour</p>
            <p className="text-lg font-bold text-gray-900">Total: {totalPrice} SEK</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!car.isAvailable || totalHours === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!session ? 'Sign in to Book' : car.isAvailable ? 'Confirm Booking' : 'Not Available'}
        </button>
      </form>
    </div>
  );
}
