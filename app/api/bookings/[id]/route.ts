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

// Add PUT method handler
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    console.log('Received update request:', updates);

    const formattedUpdates = {
      ...updates,
      startTime: new Date(updates.startTime).toISOString().split('.')[0],
      endTime: new Date(updates.endTime).toISOString().split('.')[0],
      totalPrice: Number(updates.totalPrice)
    };

    console.log('Sending to backend:', formattedUpdates);

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedUpdates),
    });

    const responseData = await response.json();
    console.log('Backend response:', responseData);

    if (!response.ok) {
      throw new Error(`Failed to update booking: ${JSON.stringify(responseData)}`);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// Add DELETE method handler if needed
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings/${params.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 