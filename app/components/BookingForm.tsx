import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:8080';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  image: string;
  location: string;
  hourRate: number;
  available: boolean;
}

const BookingForm: React.FC<{ car: Car }> = ({ car }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
          startTime: startTime,
          endTime: endTime,
          totalHours: totalHours,
          totalPrice: totalPrice,
          userEmail: userEmail,
          userName: userName,
          status: 'PENDING'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      toast.success('Booking created successfully!');
      // Redirect to bookings page with the booking ID
      router.push(`/bookings?id=${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default BookingForm; 