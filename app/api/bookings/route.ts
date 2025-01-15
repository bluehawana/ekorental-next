import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { carId, pickupTime, returnTime, totalHours, totalPrice } = body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Car Rental',
              description: `Rental period: ${totalHours} hours`,
            },
            unit_amount: totalPrice * 100, // Convert to öre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/cancel`,
      metadata: {
        carId,
        pickupTime,
        returnTime,
        totalHours: totalHours.toString(),
        totalPrice: totalPrice.toString(),
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
