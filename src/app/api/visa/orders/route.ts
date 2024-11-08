// app/api/visa/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const processingType = searchParams.get('processingType');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let whereClause: Prisma.VisaOrderWhereInput = {};

    // Name search filter
    if (name) {
      whereClause = {
        ...whereClause,
        fullName: {
          contains: name,
          mode: 'insensitive',
        },
      };
    }

    // Processing type filter
    if (processingType) {
      whereClause = {
        ...whereClause,
        processingType: {
          equals: processingType,
          mode: 'insensitive',
        },
      };
    }

    // Date range filter
    if (startDate && endDate) {
      const startDateTime = new Date(startDate);
      startDateTime.setUTCHours(0, 0, 0, 0);

      const endDateTime = new Date(endDate);
      endDateTime.setUTCHours(23, 59, 59, 999);

      whereClause = {
        ...whereClause,
        AND: [
          {
            createdAt: {
              gte: startDateTime,
            },
          },
          {
            createdAt: {
              lte: endDateTime,
            },
          },
        ],
      };
    }

    const orders = await prisma.visaOrder.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { orders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching visa orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visa orders' },
      { status: 500 }
    );
  }
}