import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { API_CONFIG } from '@/lib/api-config';
import { userService } from '@/lib/services/userService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    console.log('Session user:', session.user);
    console.log('Attempting to confirm booking:', params.id);

    // Get internal user ID
    const internalUserId = await userService.getInternalUserId(
      session.user.email!,
      session.user.id as string
    );

    // Verify booking exists and belongs to user
    const bookingResponse = await fetch(`${API_CONFIG.API_BASE_URL}/bookings/${params.id}`);
    if (!bookingResponse.ok) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = await bookingResponse.json();
    console.log('Found booking:', booking);

    // Compare with internal user ID
    if (booking.userId !== internalUserId) {
      console.error('User ID mismatch:', {
        sessionUserId: session.user.id,
        bookingUserId: booking.userId
      });
      return NextResponse.json(
        { error: 'Unauthorized to confirm this booking' },
        { status: 403 }
      );
    }

    // Confirm the booking
    const confirmResponse = await fetch(
      `${API_CONFIG.API_BASE_URL}/bookings/${params.id}/confirm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(session.user.id)
        })
      }
    );

    if (!confirmResponse.ok) {
      const errorData = await confirmResponse.json();
      console.error('Confirmation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to confirm booking' },
        { status: confirmResponse.status }
      );
    }

    const confirmedBooking = await confirmResponse.json();
    console.log('Booking confirmed successfully:', confirmedBooking);

    return NextResponse.json(confirmedBooking);

  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
} 