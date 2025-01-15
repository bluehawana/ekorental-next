import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { carId, startTime, endTime, totalPrice } = body;

    // Validate required fields
    if (!carId || !startTime || !endTime) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // First find or create user
    let user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || "",
          image: session.user.image || ""
        }
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        carId: parseInt(carId.toString()),
        startDate: new Date(startTime),
        endDate: new Date(endTime),
        status: "PENDING"
      },
      include: {
        user: true,
        car: true
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKING_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
