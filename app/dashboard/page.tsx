'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/cars');
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        console.log('Fetched cars:', data);
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const getImageUrl = (url: string) => {
    return url?.endsWith('.jpg') ? url.replace('.jpg', '.png') : url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Cars</h1>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative w-full" style={{ paddingTop: '70%' }}>
                <Image
                  src={getImageUrl(car.imageUrl)}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-contain p-4"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-car.png';
                    target.onerror = null;
                  }}
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900">{car.make} {car.model}</h2>
                <p className="text-gray-600">{car.year}</p>
                <p className="text-gray-500">{car.location}</p>
                <p className="mt-2 text-gray-700">{car.description}</p>
                <p className="mt-2 text-gray-600">License: {car.licensePlate}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xl font-bold text-gray-900">
                    {typeof car.hourRate === 'number' && car.hourRate > 0 
                      ? `${car.hourRate} SEK/h` 
                      : 'Contact for price'}
                  </p>
                  <Link 
                    href={`/cars/${car.id}/book`}
                    className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}