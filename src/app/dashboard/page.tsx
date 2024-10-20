'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerHour: number;
  licensePlate: string;
  color: string;
  imageUrl: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    // Fetch user data
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch available cars
    fetch('/api/cars')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar remains the same */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Car Models</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="relative h-48">
                <Image
                  src={car.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{car.make} {car.model}</h2>
                <p className="text-gray-600">Year: {car.year}</p>
                <p className="text-gray-600">Color: {car.color}</p>
                <p className="text-gray-600">License Plate: {car.licensePlate}</p>
                <p className="text-gray-800 font-bold mt-2">${car.pricePerHour.toFixed(2)} per hour</p>
                <Link href={`/cars/${car.id}/book`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Rent Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}