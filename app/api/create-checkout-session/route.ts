import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export async function POST(request: Request) {
  try {
    const { bookingId, amount } = await request.json();
    console.log('Received request:', { bookingId, amount });

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // First get the booking details
    console.log('Fetching booking details from:', `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`);
    const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`);
    if (!bookingResponse.ok) {
      const error = await bookingResponse.text();
      console.error('Booking fetch failed:', error);
      throw new Error(`Failed to fetch booking details: ${error}`);
    }
    const bookingData = await bookingResponse.json();
    console.log('Booking data:', bookingData);

    // Create backend payment session
    const backendPayload = {
      carId: bookingData.carId,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      totalPrice: amount
    };
    console.log('Sending to backend:', backendPayload);

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('Backend payment creation failed:', error);
      throw new Error(`Failed to create backend payment session: ${error}`);
    }
    const backendData = await backendResponse.json();
    console.log('Backend response:', backendData);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId.toString()
      },
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Car Booking #${bookingId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success?id=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/cancel?id=${bookingId}`,
    });

    console.log('Stripe session created:', session.id);
    return NextResponse.json({ id: session.id });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment session' },
      { status: 500 }
    );
  }
} 