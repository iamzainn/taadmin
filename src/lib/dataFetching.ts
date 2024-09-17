import prisma from "./db";


export async function getCustomTravelOrders(page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const [orders, totalCount] = await Promise.all([
      prisma.travelCustomBooking.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
       
      }),
      prisma.travelCustomBooking.count(),
    ]);

    return { orders, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
  } catch (error) {
    console.error("Error fetching custom travel orders:", error);
    throw new Error("Failed to fetch custom travel orders");
  }
}

export async function getTravelPackageSubscriptions(page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const [subscriptions, totalCount] = await Promise.all([
      prisma.packageSubscription.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { TravelPackage: true },
      }),
      prisma.packageSubscription.count(),
    ]);

    return { subscriptions, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
  } catch (error) {
    console.error("Error fetching travel package subscriptions:", error);
    throw new Error("Failed to fetch travel package subscriptions");
  }
}