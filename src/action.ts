"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {  ActionResult, agentSchema, bannerSchema, visaSchema} from "../src/lib/zodSchema";
import prisma from "./lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { travelPackageSchema } from "../src/lib/zodSchema";



const utapi = new UTApi();




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
        title: submission.value.title,
        imageString: submission.value.imageString,
        subtitle: submission.value.subtitle,
        For: submission.value.for
        
      },
    });
  
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
    const flattenUrls = submission.value.images.flatMap((urlString) =>
      urlString.split(",").map((url) => url.trim())
    );
  
    const dailyDetails = JSON.parse(formData.get("dailyDetails") as string);
  
    await prisma.travelPackage.create({
      data: {
        name: submission.value.name,
        durationInDays: submission.value.durationInDays,
        departureCity: submission.value.departureCity,
        arrivalCity: submission.value.arrivalCity,
        dailyDetails: dailyDetails,
        overview: submission.value.overview,
        images: flattenUrls,
        price: submission.value.price,
      },
    });
    await prisma.countries.create({
      data: {
        name: submission.value.arrivalCity,
        imageString:flattenUrls[0],
      }
    })
  
    redirect("/dashboard/packages");
  }
export async function deleteTravelPackage(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.publicMetadata.role !== "admin") throw new Error("Unauthorized");

  const packageId = formData.get("packageId") as string;
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

  
  redirect("/dashboard/packages");
}

export async function editPackage(prevState: unknown, formData: FormData) {
  
  const user = await currentUser()
  if (!user ) throw new Error("Unauthorized");
  if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");

  const submission = parseWithZod(formData, {
    schema:travelPackageSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const packageId = formData.get("packageId") as string;
  

  const { ...updateData } = submission.value;

  const flattenUrls = updateData.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const dailyDetails = JSON.parse(formData.get("dailyDetails") as string);

  try {
    await prisma.travelPackage.update({
      where: { id: packageId },
      data: {
        ...updateData,
        images: flattenUrls,
        dailyDetails,
        price:(updateData.price),
      },
    });
  } catch (error) {
    return { error: { "": ["Failed to update travel package"] } };
  }

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
    await prisma.visa.create({
      data: {
        ...submission.value,
        images: flattenUrls,
      },
    });
  } catch (error) {
    console.error("Failed to create visa:", error);
    return { message: "Failed to create visa" };
  }

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
    await prisma.visa.update({
      where: { id: visaId },
      data: {
        ...submission.value,
        images: flattenUrls,
      },
    });
  } catch (error) {
    console.error("Failed to update visa:", error);
    return { status: "error", message: "Failed to update visa" };
  }

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
    const images=formData.get("images") as string;
    const arrayImages = images.split(",")

    await Promise.all(arrayImages.map(async (image) => {
      await deleteImage(image)
    }))
   
  
    await prisma.visa.delete({
      where: {
        id: visaId,
      },
    });
  
    
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
    redirect("/dashboard/agent");
  }