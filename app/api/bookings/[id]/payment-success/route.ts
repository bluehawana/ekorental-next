import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Call backend to update status
    const response = await fetch(
      `${API_CONFIG.API_BASE_URL}${API_CONFIG.API_PATH}/bookings/${params.id}/payment-success`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update booking status');
    }

    const booking = await response.json();
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update booking status' },
      { status: 500 }
    );
  }
} 