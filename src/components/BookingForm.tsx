'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // Make sure to install @heroicons/react

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculatePrice = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffHours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
      setTotalHours(Math.round(diffHours));
      setTotalPrice(Math.round(diffHours * car.hourRate));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      toast.error('Please sign in to book a car');
      router.push('/signin');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select both pickup and return times');
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        carId: car.id,
        startTime: new Date(startDate).toISOString(),
        endTime: new Date(endDate).toISOString(),
        totalPrice: totalPrice
      };

      console.log('Creating booking:', bookingData);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const booking = await response.json();
      console.log('Booking created:', booking);

      // Redirect to payment
      const paymentResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: totalPrice
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment session');
      }

      const { url } = await paymentResponse.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Start Time */}
        <div className="relative">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-200 mb-1">
            Start Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                calculatePrice();
              }}
              required
              className="block w-full pl-10 pr-3 py-2 bg-[#1a1a2e] border border-blue-900 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
          </div>
        </div>

        {/* End Time */}
        <div className="relative">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-200 mb-1">
            End Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                calculatePrice();
              }}
              required
              className="block w-full pl-10 pr-3 py-2 bg-[#1a1a2e] border border-blue-900 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
          </div>
        </div>
      </div>

      {totalHours > 0 && (
        <div className="bg-blue-900 p-4 rounded-lg space-y-2 border border-blue-800">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-300">Duration</p>
            <p className="text-sm text-white">{totalHours} hours</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-300">Rate</p>
            <p className="text-sm text-white">{car.hourRate} SEK/hour</p>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-800">
            <p className="text-sm text-blue-300">Total Price</p>
            <p className="text-lg font-bold text-white">{totalPrice} SEK</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !car.isAvailable || totalHours === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
} 