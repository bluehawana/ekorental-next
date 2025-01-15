'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookingForm } from '@/components/bookings/BookingForm';
import { fetchApi } from '@/utils/api';

interface Car {
  id: number;
  model: string;
  // Add other car properties as needed
}

export default function CarDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        const carData = await fetchApi(`/cars/${id}`);
        setCar(carData);
      } catch (err) {
        setError('Failed to fetch car details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div>
      <h1>{car.model}</h1>
      <p>Car ID: {car.id}</p>
      {/* Display other car details as needed */}
      <h2>Book this car</h2>
      <BookingForm car={car} />
    </div>
  );
}