import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };
  }

  try {
    const orders = await prisma.travelCustomBooking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders }); // Make sure to return { orders: [...] }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}