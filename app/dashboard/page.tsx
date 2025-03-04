'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useCars } from '@/contexts/CarContext';
import { API_CONFIG } from '@/lib/api-config';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { cars, loading } = useCars();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Available Cars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse bg-gray-800 rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-6 text-white">Available Cars</h1>
        <p className="text-gray-400">No cars available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Available Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: '70%' }}>
              <Image
                src={car.imageUrl 
                  ? car.imageUrl.includes('http') 
                    ? car.imageUrl 
                    : `${API_CONFIG.BACKEND_URL}/uploads/${car.imageUrl}`
                  : '/images/placeholder-car.png'
                }
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                onError={(e: any) => {
                  console.log('Image failed to load:', car.imageUrl);
                  e.target.src = '/images/placeholder-car.png';
                }}
                unoptimized
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">{car.make} {car.model}</h2>
              <p className="text-gray-400">{car.year}</p>
              <p className="text-gray-400">{car.location}</p>
              <p className="mt-2 text-gray-300">{car.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-white">
                  {car.hourRate} SEK/h
                </p>
                <Link 
                  href={`/cars/${car.id}/book`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Rent Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}