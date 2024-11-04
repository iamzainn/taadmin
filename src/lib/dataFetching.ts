import prisma from "./db";






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



export async function getVisaOrders(page: number) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const [orders, totalCount] = await Promise.all([
      prisma.visaOrder.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.visaOrder.count(),
    ]);

    return { 
      orders, 
      totalCount, 
      totalPages: Math.ceil(totalCount / pageSize) 
    };
  } catch (error) {
    console.error("Error fetching visa orders:", error);
    throw new Error("Failed to fetch visa orders");
  }
}




