import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching booking with ID:', params.id);
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Booking not found in backend');
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      throw new Error(data.error || 'Failed to fetch booking');
    }

    console.log('Received booking:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
} 