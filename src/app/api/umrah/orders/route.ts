// app/api/umrah/orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let whereClause: any = {};

    // Name search filter
    if (name) {
      whereClause.fullName = {
        contains: name,
        mode: 'insensitive',
      };
    }

    // Date range filter
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(`${startDate}T00:00:00.000Z`),
        lte: new Date(`${endDate}T23:59:59.999Z`),
      };
    }

    const orders = await prisma.customUmrahPackage.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        familyMembers: true,
        travelDate: true,
        durationInDays: true,
        transportNeeded: true,
        createdAt: true,
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
    console.error('Error fetching Umrah orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Umrah orders' },
      { status: 500 }
    );
  }
}