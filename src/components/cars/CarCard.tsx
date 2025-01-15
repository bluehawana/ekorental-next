'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CarCardProps {
  car: {
    id: number;
    model: string;
    licensePlate: string;
    hourRate: number;
    imageUrl: string;
    isAvailable: boolean;
    location: string;
    year: number;
    description: string;
  };
}

export function CarCard({ car }: CarCardProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage = '/tesla-fallback.jpg';
  const imageUrl = imgError ? fallbackImage : car.imageUrl;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={car.model}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{car.model}</h3>
            <p className="text-gray-600 text-sm">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">${car.hourRate}/hour</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-600">{car.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">📍 {car.location}</span>
            <span>🚘 {car.licensePlate}</span>
          </div>
        </div>

        <Link 
          href={`/cars/${car.id}/book`}
          className="block w-full"
        >
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Rent Now
          </button>
        </Link>
      </div>
    </div>
  );
}
