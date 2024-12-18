"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {  ActionResult, agentSchema, bannerSchema, countriesSchema, umrahPackageSchema, visaSchema} from "../src/lib/zodSchema";
import prisma from "./lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { travelPackageSchema } from "../src/lib/zodSchema";
import { revalidatePath } from "next/cache";


const utapi = new UTApi();


// const findCountryExist = async (country: string) => {

//   return await prisma.countries.findFirst({
//     where: {
//       name: country
//     }
//   })
// }


export async function createBanner(prevState: unknown, formData: FormData) {
   
        const user = await currentUser()
        if (!user ) throw new Error("Unauthorized");
       
        if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
  
   
  
    const submission = parseWithZod(formData, {
      schema: bannerSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    await prisma.banner.create({
      data: {
        
        imageString: submission.value.imageString,
        For: submission.value.for
        
      },
    });
    revalidatePath("/dashboard/banner");
    redirect("/dashboard/banner");
  }
  
  export async function deleteBanner(formData: FormData) {
    
    const user = await currentUser()
    if (!user ) throw new Error("Unauthorized");
   
    if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
     
     const bannerImageId = formData.get("image") as string;

     await Promise.all([deleteImage(bannerImageId)]);
    await prisma.banner.delete({
      where: {
        id: formData.get("bannerId") as string,
      },

    });
    
    revalidatePath("/dashboard/banner");
    redirect("/dashboard/banner");
  }


  


  export async function createTravelPackage(prevState: unknown, formData: FormData) {
    const user = await currentUser()
    if (!user ) throw new Error("Unauthorized");
    
    if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
  
    const submission = parseWithZod(formData, {
      schema: travelPackageSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const dailyDetails = JSON.parse(formData.get("dailyDetails") as string);
    const categories = JSON.parse(formData.get('categories') as string);
    const images = JSON.parse(formData.get('images') as string);
    const includes = JSON.parse(formData.get('includes') as string);
    const excludes = JSON.parse(formData.get('excludes') as string);
    
    
    const numberOfNights = submission.value.durationInDays - 1;
    const validFrom = new Date(submission.value.validFrom);
    const validUntil = new Date(submission.value.validUntil);
    const now = new Date();
    const isActive = now >= validFrom && now <= validUntil;
  
    await prisma.travelPackage.create({
      data: {
        name: submission.value.name,
        price: BigInt(submission.value.price),
        durationInDays: submission.value.durationInDays,
        numberOfNights,
        departureFrom: submission.value.departureFrom,
        arrival: submission.value.arrival,
        Country: submission.value.Country,
        dailyDetails,
        overview: submission.value.overview,
        images,
      
        isFeatured: submission.value.isFeatured ?? false,
        categories,
        includes,
        excludes,
        validFrom,
        validUntil,
        isActive,
      },
    });

    revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages");
  }
export async function deleteTravelPackage(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.publicMetadata.role !== "admin") throw new Error("Unauthorized");

  const packageId = formData.get("packageId") as string;
  // const arrival = formData.get("arrival") as string;
  const images=formData.get("images") as string;
    const arrayImages = images.split(",")

    await Promise.all(arrayImages.map(async (image) => {
      await deleteImage(image)
    }))

  await prisma.travelPackage.delete({
    where: {
      id: packageId,
    },
  });


 

  revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages");
}

export async function editPackage(prevState: unknown, formData: FormData) {
  const user = await currentUser()
  if (!user ) throw new Error("Unauthorized");
  if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");

  const submission = parseWithZod(formData, {
    schema: travelPackageSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const packageId = formData.get("packageId") as string;
  const { ...updateData } = submission.value;

  const images = JSON.parse(formData.get("images") as string);
  const dailyDetails = JSON.parse(formData.get("dailyDetails") as string);
  const categories = JSON.parse(formData.get("categories") as string);
  const includes = JSON.parse(formData.get("includes") as string);
  const excludes = JSON.parse(formData.get("excludes") as string);

  // Calculate number of nights and isActive status
  const numberOfNights = updateData.durationInDays - 1;
  const validFrom = new Date(updateData.validFrom);
  const validUntil = new Date(updateData.validUntil);
  const now = new Date();
  const isActive = now >= validFrom && now <= validUntil;

  try {
    await prisma.travelPackage.update({
      where: { id: packageId },
      data: {
        name: updateData.name,
        durationInDays: updateData.durationInDays,
        numberOfNights,
        departureFrom: updateData.departureFrom,
        arrival: updateData.arrival,
        Country: updateData.Country,
        overview: updateData.overview,
        price: BigInt(updateData.price),
        images,
        dailyDetails,
        categories,
        includes,
        excludes,
        isFeatured: updateData.isFeatured ?? false,
        validFrom,
        validUntil,
        isActive,
      },
    });
  } catch (error) {
    return { error: { "": ["Failed to update travel package"] } };
  }
  
  revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages");
}

export async function createVisa(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, { schema: visaSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  try {
    await prisma.$transaction(async (tx) => {
      // First, find or create the country
      const country = await tx.visaCountries.upsert({
        where: { name: submission.value.countryName },
        create: { name: submission.value.countryName },
        update: {} // No updates needed if exists
      });

      // Then create the visa with the country reference
      await tx.visa.create({
        data: {
          ...submission.value,
          images: flattenUrls,
          countryId: country.id
        },
      });
    });
  } catch (error) {
    console.error("Failed to create visa:", error);
    return { message: "Failed to create visa" };
  }
  
  revalidatePath("/dashboard/visa");
  redirect("/dashboard/visa");
}

export async function editVisa(prevState: unknown, formData: FormData) {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, { schema: visaSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const visaId = formData.get("visaId") as string;
  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  try {
    await prisma.$transaction(async (tx) => {
      // Get the current visa to check if country changed
      const currentVisa = await tx.visa.findUnique({
        where: { id: visaId },
        select: { countryName: true, countryId: true }
      });

      if (!currentVisa) throw new Error("Visa not found");

      // If country changed, handle the country update
      if (currentVisa.countryName !== submission.value.countryName) {
        // Create or get the new country
        const newCountry = await tx.visaCountries.upsert({
          where: { name: submission.value.countryName },
          create: { name: submission.value.countryName },
          update: {}
        });

        // Update the visa with new country
        await tx.visa.update({
          where: { id: visaId },
          data: {
            ...submission.value,
            images: flattenUrls,
            countryId: newCountry.id
          },
        });

        // Check if old country has any other visas
        const oldCountryVisaCount = await tx.visa.count({
          where: { countryId: currentVisa.countryId }
        });

        // If no other visas use this country, delete it
        if (oldCountryVisaCount === 0) {
          await tx.visaCountries.delete({
            where: { id: currentVisa.countryId }
          });
        }
      } else {
        // If country hasn't changed, just update the visa
        await tx.visa.update({
          where: { id: visaId },
          data: {
            ...submission.value,
            images: flattenUrls
          },
        });
      }
    });
  } catch (error) {
    console.error("Failed to update visa:", error);
    return { status: "error", message: "Failed to update visa" };
  }

  revalidatePath("/dashboard/visa");
  redirect("/dashboard/visa");
}


  export async function deleteImage(imageUrl:string) {
  
    if (!imageUrl) {
      return { status: "error", message: "Missing required data" };
    }
    try {
      const fileKey = imageUrl.split('/').pop();
      if (!fileKey) {
        throw new Error("Invalid image URL");
      }
      await utapi.deleteFiles([fileKey]);
      return { status: "success", message: "Image deleted successfully" };
    } catch (error) {
      console.error("Failed to delete image:", error);
      return { status: "error", message: "Failed to delete image" };
    }
  }

  export async function deleteVisa(formData: FormData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");
    if (user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
  
    const visaId = formData.get("visaId") as string;
    const images = formData.get("images") as string;
    const arrayImages = images.split(",");
  
    try {
      await prisma.$transaction(async (tx) => {
        // Get the visa to be deleted
        const visa = await tx.visa.findUnique({
          where: { id: visaId },
          select: { countryId: true }
        });
  
        if (!visa) throw new Error("Visa not found");
  
        // Delete images
        await Promise.all(arrayImages.map(async (image) => {
          await deleteImage(image);
        }));
  
        // Delete the visa
        await tx.visa.delete({
          where: { id: visaId },
        });
  
        // Check if country has any other visas
        const countryVisaCount = await tx.visa.count({
          where: { countryId: visa.countryId }
        });
  
        // If no other visas use this country, delete it
        if (countryVisaCount === 0) {
          await tx.visaCountries.delete({
            where: { id: visa.countryId }
          });
        }
      });
    } catch (error) {
      console.error("Failed to delete visa:", error);
      throw new Error("Failed to delete visa");
    }
  
    revalidatePath("/dashboard/visa");
    redirect("/dashboard/visa");
  }



  export async function createAgent(prevState: unknown, formData: FormData): Promise<ActionResult> {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return { status: 'error', message: "Unauthorized" };
    }
  
    const submission = parseWithZod(formData, { schema: agentSchema });
  
    if (submission.status !== "success") {
      return { status: 'error', message: "Validation failed" };
    }
  
    try {
      await prisma.agent.create({
        data: submission.value,
      });
          
      

      
    } catch (error) {
      console.error("Failed to create agent:", error);
      return { status: 'error', message: "Failed to create agent" };
    }
    revalidatePath("/dashboard/agent");
    redirect("/dashboard/agent");

  }
  
  export async function updateAgent(prevState: unknown, formData: FormData): Promise<ActionResult> {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return { status: 'error', message: "Unauthorized" };
    }
  
    const submission = parseWithZod(formData, { schema: agentSchema });
  
    if (submission.status !== "success") {
      return { status: 'error', message: "Validation failed" };
    }
  
    const agentId = formData.get("agentId") as string;
  
    try {
      await prisma.agent.update({
        where: { id: agentId },
        data: submission.value,
      });


     
      
    } catch (error) {
      console.error("Failed to update agent:", error);
      return { status: 'error', message: "Failed to update agent" };
    }
    
    revalidatePath("/dashboard/agent");
    redirect("/dashboard/agent");
    
  }
  
  export async function deleteAgent( formData: FormData): Promise<ActionResult> {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      return { status: 'error', message: "Unauthorized" };
    }
  
    const agentId = formData.get("agentId") as string;
  
    try {
      await prisma.agent.delete({
        where: { id: agentId },
      });

      
      
    } catch (error) {
      console.error("Failed to delete agent:", error);
      return { status: 'error', message: "Failed to delete agent" };
    }

    revalidatePath("/dashboard/agent");
    redirect("/dashboard/agent");
  }


  export async function createUmrahPackage(prevState: unknown, formData: FormData) {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      throw new Error("Unauthorized");
    }
  
    const submission = parseWithZod(formData, {
      schema: umrahPackageSchema,
    });
    
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const includes = JSON.parse(formData.get("includes") as string);
    const excludes = JSON.parse(formData.get("excludes") as string);
  
    await prisma.umrahPackage.create({
      data: {
        title: submission.value.title,
        description: submission.value.description,
        hotelMakkah: submission.value.hotelMakkah,
        hotelMakkahRating: Number(submission.value.hotelMakkahRating),
        hotelMadinah: submission.value.hotelMadinah,
        hotelMadinahRating: Number(submission.value.hotelMadinahRating),
        nightsInMakkah: Number(submission.value.nightsInMakkah),
        nightsInMadinah: Number(submission.value.nightsInMadinah),
        includes,
        excludes,
        Double_Price: BigInt(submission.value.Double_Price),
        Quad_Price: BigInt(submission.value.Quad_Price),
        Sharing_Price: BigInt(submission.value.Sharing_Price),
        Triple_Price: BigInt(submission.value.Triple_Price),
        image: submission.value.image,
      },
    });
        
    revalidatePath("/dashboard/umrah-packages");
    redirect("/dashboard/umrah-packages");
  }

  export async function editUmrahPackage(prevState: unknown, formData: FormData) {
    const user = await currentUser()
    if (!user ) throw new Error("Unauthorized");
    if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
  
    const submission = parseWithZod(formData, {
      schema: umrahPackageSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
    const packageId = formData.get("packageId") as string;
    const { ...updateData } = submission.value;
  
    const includes = JSON.parse(formData.get("includes") as string);
    const excludes = JSON.parse(formData.get("excludes") as string);
  
    try {
      await prisma.umrahPackage.update({
        where: { id: packageId },
        data: {
          title: updateData.title,
          description: updateData.description,
          hotelMakkah: updateData.hotelMakkah,
          hotelMakkahRating: Number(updateData.hotelMakkahRating),
          hotelMadinah: updateData.hotelMadinah,
          hotelMadinahRating: Number(updateData.hotelMadinahRating),
          nightsInMakkah: Number(updateData.nightsInMakkah),
          nightsInMadinah: Number(updateData.nightsInMadinah),
          Double_Price: BigInt(updateData.Double_Price),
          Quad_Price: BigInt(updateData.Quad_Price),
          Sharing_Price: BigInt(updateData.Sharing_Price),
          Triple_Price: BigInt(updateData.Triple_Price),
          image: updateData.image,
          includes,
          excludes,
        },
      });
    } catch (error) {
      return { error: { "": ["Failed to update Umrah package"] } };
    }
  
    revalidatePath("/dashboard/umrah-packages");
    redirect("/dashboard/umrah-packages");
  }



  export async function deleteUmrahPackage(formData: FormData) {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      throw new Error("Unauthorized");
    }
  
    const id = formData.get("id") as string;
    if (!id) {
      return { error: "Package ID is required" };
    }
  
    try {
      const p = await prisma.umrahPackage.findUnique({
        where: { id },
        select: { image: true },
      });
  
      if (p?.image) {
        await deleteImage(p.image);
      }
  
      await prisma.umrahPackage.delete({
        where: { id },
      });
    } catch (error) {
      return { error: "Failed to delete Umrah package" };
    }
  
    revalidatePath("/dashboard/umrah-packages");
    redirect("/dashboard/umrah-packages");
  }


  export const createCarouselCountry = async ( formData: FormData) => {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const submission = parseWithZod(formData, {
      schema:   countriesSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.countries.create({
      data: {
        name: submission.value.name,
        // image: submission.value.image,
      },
    });


    revalidatePath("/dashboard/CarouselCountries");
    redirect("/dashboard/CarouselCountries");
  }

  export const updateCarouselCountry = async ( formData: FormData) => {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      throw new Error("Unauthorized");
    }


    const id = formData.get("id") as string;
    const submission = parseWithZod(formData, {
      schema:   countriesSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.countries.update({
      where: { id },
      data: {
        name: submission.value.name,
        // image: submission.value.image,
      },
    });


    revalidatePath("/dashboard/CarouselCountries");
    redirect("/dashboard/CarouselCountries");
  }

  export const deleteCarouselCountry = async ( formData: FormData) => {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== "admin") {
      throw new Error("Unauthorized");
    }


    const id = formData.get("id") as string;

    console.log("id : ",id)
   
    try {
      await prisma.countries.delete({
        where: { id },
      })
          
      

      
    } catch (error) {
      console.error("Failed to create country:", error);
      return { status: 'error', message: "Failed to create countries" };
    }

   
  
    revalidatePath("/dashboard/CarouselCountries");
    redirect("/dashboard/CarouselCountries");
  };



  export async function deleteCustomOrder(id: string) {
    try {
      await prisma.travelCustomBooking.delete({
        where: { id },
      });
      revalidatePath('/dashboard/travelOrders'); // Adjust this path to your actual route
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: 'Failed to delete order' };
    }
  }


export async function deletePackageSubscription(id: string) {
  try {
    await prisma.packageSubscription.delete({
      where: { id },
    });
    revalidatePath('/dashboard/travelOrders'); // Adjust this path to your actual route
    return { success: true };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return { success: false, error: 'Failed to delete subscription' };
  }
}


export async function deleteUmrahCustomOrder(id: string) {
  try {
    await prisma.customUmrahPackage.delete({
      where: { id },
    });
    revalidatePath('/dashboard/UmrahOrders');
    return { success: true };
  } catch (error) {
    console.error('Error deleting Umrah order:', error);
    return { success: false, error: 'Failed to delete Umrah order' };
  }
}

export async function deleteUmrahSubscription(id: string) {
  try {
    await prisma.umrahPackageSubscription.delete({
      where: { id },
    });
    revalidatePath('/dashboard/UmrahOrders');
    return { success: true };
  } catch (error) {
    console.error('Error deleting Umrah subscription:', error);
    return { success: false, error: 'Failed to delete Umrah subscription' };
  }
}


export async function deleteVisaOrder(id: string) {
  try {
    await prisma.visaOrder.delete({
      where: { id },
    });

    revalidatePath('/dashboard/VisaOrders');
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Error deleting visa order:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete visa order'
    };
  }
}

// Optional: Helper function to get visa order details
export async function getVisaOrder(id: string) {
  try {
    const order = await prisma.visaOrder.findUnique({
      where: { id },
    });

    return order;
  } catch (error) {
    console.error('Error fetching visa order:', error);
    return null;
  }
}
  