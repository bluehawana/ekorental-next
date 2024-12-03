'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CarCardProps {
  car: {
    id: number;
    make: string;
    model: string;
    year: number;
    hour_rate: number;
    licensePlate: string;
    location: string;
    imageUrl: string;
    description: string;
  };
}

export function CarCard({ car }: CarCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = car.imageUrl.endsWith('.jpg') 
    ? car.imageUrl.replace('.jpg', '.png')
    : car.imageUrl;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {car.make} {car.model} {car.year}
        </h3>
        <div className="mt-2 space-y-2">
          <p className="text-gray-600">Location: {car.location}</p>
          <p className="text-gray-600">License: {car.licensePlate}</p>
          <p className="text-sm text-gray-500">{car.description}</p>
          <p className="text-lg font-bold text-green-600">{car.hourRate}</p>
          <p className="text-gray-600">Price: {car.hourRate} kr/h</p>
        </div>
        </div>
        <Link
          href={`/cars/${car.id}/book`}
          className="mt-4 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
