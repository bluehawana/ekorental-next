import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

async function fetchCarsFromBackend() {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch cars');
    const data = await response.json();
    
    // Transform backend data to match our frontend structure
    return data.map((car: any) => ({
      id: car.id.toString(),
      model: car.model,
      price: parseFloat(car.price),
      costPerHour: parseFloat(car.costPerHour || car.price), // fallback to price if costPerHour not available
      imageUrl: car.imageUrl.startsWith('http') ? car.imageUrl : `${API_CONFIG.UPLOADS_URL}/${car.imageUrl}`,
      description: car.description,
      plateNumber: car.plateNumber || 'N/A',
      location: car.location || 'Gothenburg',
      year: car.year || '2024',
    }));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return null;
  }
}

export async function GET() {
  const cars = await fetchCarsFromBackend();
  if (!cars) {
    return new NextResponse('Failed to fetch cars', { status: 500 });
  }
  return NextResponse.json(cars);
}

