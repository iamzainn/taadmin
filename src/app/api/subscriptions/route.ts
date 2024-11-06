import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
export const revalidate = 0

// Helper function to handle BigInt serialization
const serializeData = (data: unknown) => {
  return JSON.parse(
    JSON.stringify(
      data,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    )
  );
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause step by step
    let whereClause: Prisma.PackageSubscriptionWhereInput = {};

    // Add destination filter if provided
    if (destination) {
      whereClause = {
        TravelPackage: {
          arrival: {
            contains: destination,
            mode: 'insensitive',
          }
        },
      };
    }

    // Add date range filter if both dates are provided
    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        createdAt: {
          gte: new Date(startDate + 'T00:00:00.000Z'),
          lte: new Date(endDate + 'T23:59:59.999Z'),
        },
      };
    }

    const subscriptions = await prisma.packageSubscription.findMany({
      where: whereClause,
      include: {
        TravelPackage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize the data to handle BigInt values
    const serializedSubscriptions = serializeData(subscriptions);

    return NextResponse.json({
      subscriptions: serializedSubscriptions,
      success: true,
    });

  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: 'Failed to fetch subscriptions',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}