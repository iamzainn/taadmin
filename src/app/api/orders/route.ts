// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination') || undefined;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let whereClause = {};

  if (destination) {
    whereClause = {
      ...whereClause,
      Destination: {
        contains: destination,
        mode: 'insensitive',
      },
    };
  }

  if (startDate && endDate) {
    whereClause = {
      ...whereClause,
      createdAt: {
        gte: new Date(`${startDate}T00:00:00.000Z`),
        lte: new Date(`${endDate}T23:59:59.999Z`),
      },
    };
  }

  try {
    const orders = await prisma.travelCustomBooking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}