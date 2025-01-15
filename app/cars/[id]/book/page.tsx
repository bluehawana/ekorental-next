'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/lib/api-config';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { use } from 'react';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CarBookingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch car');
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [resolvedParams.id]);

  const calculatePrice = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInHours = Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
      setTotalHours(Math.round(diffInHours));
      setTotalPrice(Math.round(diffInHours * (car?.hourRate || 0)));
    }
  };

  const handleDateChange = () => {
    calculatePrice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car?.isAvailable) {
      toast.error('This car is not available for booking');
      return;
    }

    try {
      const bookingData = {
        carId: car.id,
        startTime: startDate,
        endTime: endDate,
        totalPrice: totalPrice,
        // Add any other required fields
      };

      console.log('Sending booking data:', bookingData); // For debugging

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create booking');
      }

      const result = await response.json();
      console.log('Booking result:', result); // For debugging

      toast.success('Added to cart successfully!');
      // Optionally redirect to cart or bookings page
      // router.push('/cart');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error || !car) return <div className="p-4 text-red-500">{error || 'Car not found'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Car Image */}
        <div className="relative h-72">
          <Image
            src={car.imageUrl}
            alt={car.model}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Car Details and Booking Form */}
        <div className="p-6">
          {/* Car Info Section */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{car.model}</h1>
                <p className="text-gray-600">{car.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{car.hourRate} SEK/hour</p>
                <p className="text-gray-500">License: {car.licensePlate}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 space-x-4 mb-6">
              <span>📍 {car.location}</span>
              <span>📅 {car.year}</span>
              <span>✅ {car.isAvailable ? 'Available' : 'Not Available'}</span>
            </div>
          </div>

          {/* Booking Form Section */}
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
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Duration: {totalHours} hours</p>
                    <p className="text-sm text-gray-600">Rate: {car.hourRate} SEK/hour</p>
                  </div>
                  <p className="text-xl font-bold">Total: {totalPrice} SEK</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!car.isAvailable || totalHours === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {car.isAvailable ? 'Add to Cart' : 'Not Available'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
