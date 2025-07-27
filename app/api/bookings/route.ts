import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { userService } from '@/lib/services/userService';

export async function GET() {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const bookings = await response.json();
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received booking data:', body);

    // Validate required fields
    if (!body.carId || !body.startDate || !body.endDate || !body.totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get internal user ID
    const internalUserId = await userService.getInternalUserId(
      session.user.email!,
      session.user.id as string
    );

    const bookingData = {
      carId: body.carId,
      userId: internalUserId,
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: body.totalPrice,
      status: 'PENDING'
    };

    console.log('Creating booking with data:', bookingData);

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to create booking' },
        { status: response.status }
      );
    }

    const booking = await response.json();
    console.log('Booking created:', booking);

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
