import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-config";

interface RouteContext {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/cars/${context.params.id}`);
    if (!response.ok) throw new Error('Failed to fetch car');
    const car = await response.json();
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, totalPrice } = body;

    const car = await prisma.car.findUnique({
      where: {
        id: parseInt(context.params.id)
      }
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (!car.available) {
      return NextResponse.json({ error: "Car is not available" }, { status: 400 });
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
            id: parseInt(context.params.id)
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

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function HEAD(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const url = new URL(request.url);
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    if (!startTime || !endTime) {
      return new NextResponse('Start time and end time are required', { status: 400 });
    }

    const response = await fetch(
      `${API_CONFIG.API_BASE_URL}/cars/${context.params.id}/availability?startTime=${startTime}&endTime=${endTime}`
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