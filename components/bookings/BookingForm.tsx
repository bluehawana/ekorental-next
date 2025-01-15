'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { fetchApi } from '@/utils/api';

interface BookingFormProps {
  car: {
    id: number;
    hourRate: number;
  };
}

export function BookingForm({ car }: BookingFormProps) {
  const { data: session } = useSession();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const totalPrice = useMemo(() => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return durationInHours * car.hourRate;
  }, [startTime, endTime, car.hourRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!session?.user?.id) {
        throw new Error('Please login to make a booking');
      }

      const bookingData = {
        carId: car.id,
        userId: session.user.id,
        startTime: startTime,  // Changed from pickupTime
        endTime: endTime,      // Changed from returnTime
        totalPrice: totalPrice,
        status: 'PENDING'
      };

      console.log('Sending booking data:', bookingData); // Debug log

      const response = await fetchApi('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Booking confirmed:', response);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="startTime">Start Time</label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="endTime">End Time</label>
        <input
          id="endTime"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded"
          required
        />
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <div className="font-semibold">
        Total Price: ${totalPrice.toFixed(2)}
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        disabled={!session?.user}
      >
        {session?.user ? 'Book Now' : 'Please Login to Book'}
      </button>
    </form>
  );
}