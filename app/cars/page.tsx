'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import Image from 'next/image';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  hourRate: number;
  imageUrl: string;
  description: string;
  location: string;
  isAvailable: boolean;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cars');
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const displayedCars = showAll ? cars : cars.filter(car => car.isAvailable);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse bg-gray-800 h-96">
              <div className="h-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">
          {showAll ? 'All Cars' : 'Available Cars'}
        </h1>
        <Button 
          onClick={() => setShowAll(!showAll)}
          variant="secondary"
        >
          {showAll ? 'Show Available Only' : 'Show All Cars'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCars.map((car) => (
          <Link href={`/cars/${car.id}`} key={car.id}>
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gray-800">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <Image
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover rounded-t-lg"
                  unoptimized
                />
                {showAll && (
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                    car.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}>
                    {car.isAvailable ? 'Available' : 'Booked'}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {car.make} {car.model}
                </h2>
                <div className="flex items-center text-gray-400 space-x-4 mb-2">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.location}</span>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">{car.description}</p>
                <div className="text-lg font-semibold text-white">
                  {car.hourRate} SEK/hour
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {displayedCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {showAll ? 'No cars found' : 'No available cars at the moment'}
          </p>
        </div>
      )}
    </div>
  );
} 