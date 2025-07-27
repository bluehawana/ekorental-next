import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return new NextResponse(
        `Failed to fetch booking: ${errorText}`,
        { status: response.status }
      );
    }

    const booking = await response.json();

    if (!booking) {
      return new NextResponse('Booking not found', { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Car Rental - Booking #${booking.id}`,
              description: `Rental period: ${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}`,
            },
            unit_amount: Math.round(parseFloat(booking.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success?id=${booking.id}`,
      metadata: {
        bookingId: booking.id.toString(),
      },
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe session URL');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return new NextResponse(
      'Error creating payment session',
      { status: 500 }
    );
  }
} 