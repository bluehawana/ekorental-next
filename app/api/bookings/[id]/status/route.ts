import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { status } = await req.json();
    const bookingId = params.id;

    console.log(`Attempting to update booking ${bookingId} to status: ${status}`);

    // First, fetch the booking to ensure it exists and belongs to the user
    const bookingResponse = await fetch(`http://localhost:8080/api/bookings/${bookingId}`);
    const bookingText = await bookingResponse.text();
    
    if (!bookingResponse.ok) {
      console.error('Failed to fetch booking:', bookingText);
      return new NextResponse(`Failed to fetch booking: ${bookingText}`, { status: bookingResponse.status });
    }

    let booking;
    try {
      booking = JSON.parse(bookingText);
    } catch (e) {
      console.error('Failed to parse booking response:', bookingText);
      return new NextResponse('Invalid booking data received', { status: 500 });
    }

    if (booking.userId.toString() !== session.user.id) {
      return new NextResponse('Unauthorized - Booking belongs to different user', { status: 403 });
    }

    // Update the booking status
    const updateResponse = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...booking,
        status: status,
      }),
    });

    const updateText = await updateResponse.text();
    console.log('Update response:', {
      status: updateResponse.status,
      body: updateText
    });

    if (!updateResponse.ok) {
      return new NextResponse(
        `Failed to update booking: ${updateText}`,
        { status: updateResponse.status }
      );
    }

    let updatedBooking;
    try {
      updatedBooking = JSON.parse(updateText);
    } catch (e) {
      console.error('Failed to parse update response:', updateText);
      return new NextResponse('Invalid response data received', { status: 500 });
    }

    // Send confirmation email
    if (status === 'CONFIRMED') {
      try {
        await fetch(`http://localhost:8080/api/notifications/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: session.user.email,
            subject: `Booking #${bookingId} Confirmed`,
            template: 'BOOKING_CONFIRMATION',
            data: {
              bookingId: bookingId,
              startTime: booking.startTime,
              endTime: booking.endTime,
              totalPrice: booking.totalPrice,
              carDetails: `${booking.car?.brand} ${booking.car?.model}`,
              userName: session.user.name,
            },
          }),
        });
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Status update error:', error);
    return new NextResponse(
      'Internal server error while updating booking status',
      { status: 500 }
    );
  }
} 