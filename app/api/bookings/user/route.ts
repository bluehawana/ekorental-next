import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('No user ID in session');
      return new NextResponse('Unauthorized - Please sign in', { status: 401 });
    }

    const userId = session.user.id;
    console.log('Fetching bookings for user ID:', userId);

    // First, fetch the bookings
    const bookingsResponse = await fetch(`http://localhost:8080/api/bookings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!bookingsResponse.ok) {
      const errorText = await bookingsResponse.text();
      console.error('Backend API error:', {
        status: bookingsResponse.status,
        statusText: bookingsResponse.statusText,
        error: errorText,
        userId,
      });
      return new NextResponse(
        `Failed to fetch user bookings: ${errorText}`,
        { status: bookingsResponse.status }
      );
    }

    const bookings = await bookingsResponse.json();

    // Then, fetch car details for each booking
    const bookingsWithCars = await Promise.all(
      bookings.map(async (booking: any) => {
        try {
          const carResponse = await fetch(`http://localhost:8080/api/cars/${booking.carId}`);
          if (carResponse.ok) {
            const car = await carResponse.json();
            return {
              ...booking,
              car: {
                id: car.id,
                brand: car.brand || 'Tesla',
                model: car.model || 'Unknown Model',
                image: car.image,
                pricePerHour: car.pricePerHour
              }
            };
          }
          console.warn(`Could not fetch car details for booking ${booking.id}`);
          return booking;
        } catch (error) {
          console.error(`Failed to fetch car details for booking ${booking.id}:`, error);
          return booking;
        }
      })
    );

    console.log(`Successfully fetched ${bookingsWithCars.length} bookings with car details for user ${userId}`);
    return NextResponse.json(bookingsWithCars);
  } catch (error) {
    console.error('Error in /api/bookings/user:', error);
    return new NextResponse(
      'Internal server error while fetching bookings',
      { status: 500 }
    );
  }
} 