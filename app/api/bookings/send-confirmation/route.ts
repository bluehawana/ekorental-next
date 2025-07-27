import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error('User not authenticated');
    }

    const { bookingId } = await request.json();

    const response = await fetch(`${API_CONFIG.API_BASE_URL}/bookings/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking details');
    }

    const booking = await response.json();

    // Send email using your email service
    await fetch(`${API_CONFIG.API_BASE_URL}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: session.user.email,
        subject: `Booking Confirmation - #${bookingId}`,
        template: 'booking-confirmation',
        data: {
          bookingId,
          startTime: new Date(booking.startTime).toLocaleString(),
          endTime: new Date(booking.endTime).toLocaleString(),
          totalPrice: booking.totalPrice,
          status: booking.status,
        },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 