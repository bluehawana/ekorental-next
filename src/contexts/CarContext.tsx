'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG } from '@/lib/api-config';

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
  isAvailable: boolean;
}

interface CarContextType {
  cars: Car[];
  loading: boolean;
  error: string | null;
  refetchCars: () => Promise<void>;
  getCarById: (id: number) => Car | undefined;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export function CarProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars`);
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      setCars(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const getCarById = (id: number) => {
    return cars.find(car => car.id === id);
  };

  return (
    <CarContext.Provider value={{ cars, loading, error, refetchCars: fetchCars, getCarById }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
} 