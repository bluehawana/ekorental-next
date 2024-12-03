'use client';

import { useEffect, useState } from 'react';
import { CarCard } from './CarCard';

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

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/cars', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }

        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError(error instanceof Error ? error.message : 'Failed to load cars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading cars...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={{
            ...car,
            price: `${car.hourRate} kr/h`,
          }}
        />
      ))}
    </div>
  );
}
