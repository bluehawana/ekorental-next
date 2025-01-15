import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    const car = await response.json();
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Failed to fetch car', { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { startDate, endDate, totalPrice } = body;

    // Validate the car exists
    const car = await prisma.car.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });

    if (!car) {
      return new Response("Car not found", { status: 404 });
    }

    if (!car.available) {
      return new Response("Car is not available", { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        user: {
          connect: {
            email: session.user.email
          }
        },
        car: {
          connect: {
            id: parseInt(params.id)
          }
        },
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "PENDING"
      },
      include: {
        user: true,
        car: true
      }
    });

    return Response.json(booking);
  } catch (error) {
    console.error("[BOOKING_ERROR]", error);
    return new Response("Internal Error", { status: 500 });
  }
}

// Optional: Add a method to check car availability for specific dates
export async function HEAD(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    if (!startTime || !endTime) {
      return new NextResponse('Start time and end time are required', { status: 400 });
    }

    const response = await fetch(
      `${API_CONFIG.API_BASE_URL}/cars/${params.id}/availability?startTime=${startTime}&endTime=${endTime}`
    );

    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    const availability = await response.json();
    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error checking availability:', error);
    return new NextResponse('Failed to check availability', { status: 500 });
  }
} 