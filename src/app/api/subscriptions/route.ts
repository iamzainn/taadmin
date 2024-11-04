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
      TravelPackage: {
        destination: {
          contains: destination,
          mode: 'insensitive',
        },
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
    const subscriptions = await prisma.packageSubscription.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { TravelPackage: true },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}