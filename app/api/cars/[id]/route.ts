import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${params.id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    
    const car = await response.json();
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return new NextResponse('Failed to fetch car', { status: 500 });
  }
} 