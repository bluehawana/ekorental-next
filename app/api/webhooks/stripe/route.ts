import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        // Update booking status
        const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/payment-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update booking status');
        }

        // Send confirmation email
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/booking-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            email: session.customer_details?.email
          }),
        });
      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Failed to process payment completion' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
} 