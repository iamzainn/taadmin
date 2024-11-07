// app/api/umrah/subscriptions/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const packageName = searchParams.get('packageName');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    let whereClause: Prisma.UmrahPackageSubscriptionWhereInput = {};

    // Name search filter
    if (name) {
      whereClause = {
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } },
        ],
      };
    }

    // Package name filter
    if (packageName) {
      whereClause = {
        ...whereClause,
        UmrahPackage: {
          title: {
            contains: packageName,
            
            mode: 'insensitive',
          },
        },
      };
    }

    // Date range filter
    if (startDate && endDate) {
      whereClause = {
        ...whereClause,
        createdAt: {
          gte: new Date(`${startDate}T00:00:00.000Z`),
          lte: new Date(`${endDate}T23:59:59.999Z`),
        },
      };
    }

    const subscriptions = await prisma.umrahPackageSubscription.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        UmrahPackage: {
          select: {
            title: true,
          },
        },
      } satisfies Prisma.UmrahPackageSubscriptionInclude,
    });

    return NextResponse.json(
      { 
        subscriptions,
        success: true 
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Umrah subscriptions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Umrah subscriptions',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

// Types for better type safety

// Helper function for type-safe error responses
