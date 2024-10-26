import prisma from "../lib/db";


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


export async function getCustomUmrahOrders(page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
 


   const [orders,totalCount]= await Promise.all([
      prisma.customUmrahPackage.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },

      }),
      prisma.customUmrahPackage.count(),
    ])
    return {
      orders,totalCount,totalPages:Math.ceil(totalCount / pageSize)
    }
  } catch (error) {
    console.error("Error fetching custom Umrah orders:", error);
    throw new Error("Failed to fetch custom Umrah orders");
  }
}

export async function getUmrahPackageSubscriptions(page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const [subscriptions, totalCount] = await Promise.all([
      prisma.umrahPackageSubscription.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { UmrahPackage: true },
      }),
      prisma.umrahPackageSubscription.count(),
    ]);

    return { 
      subscriptions, 
      totalCount, 
      totalPages: Math.ceil(totalCount / pageSize) 
    };
  } catch (error) {
    console.error("Error fetching Umrah package subscriptions:", error);
    throw new Error("Failed to fetch Umrah package subscriptions");
  }
}





