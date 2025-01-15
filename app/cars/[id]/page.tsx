'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/lib/api-config';
import Image from 'next/image';
import Link from 'next/link';

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

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${params.id}`);
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
  }, [params.id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error || !car) {
    return <div className="p-4 text-red-500">{error || 'Car not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={car.imageUrl}
            alt={car.model}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{car.model}</h1>
              <p className="text-gray-600">{car.year}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${car.hourRate}/hour</p>
              <p className="text-gray-500">License: {car.licensePlate}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">{car.description}</p>
            <div className="flex items-center text-gray-600">
              <span className="mr-4">📍 {car.location}</span>
              <span className="mr-4">🚗 {car.licensePlate}</span>
              <span>✅ {car.isAvailable ? 'Available' : 'Not Available'}</span>
            </div>
          </div>

          <Link 
            href={`/cars/${car.id}/book`}
            className="mt-8 block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            {car.isAvailable ? 'Book Now' : 'Currently Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
} 