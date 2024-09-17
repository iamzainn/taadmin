"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {  bannerSchema} from "../src/lib/zodSchema";
import prisma from "./lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { travelPackageSchema } from "../src/lib/zodSchema";

 const deleteUTFiles = async (files: string[]) => {
  const utapi = new UTApi();
  try {
    await utapi.deleteFiles(files);
  } catch (error) {
    console.error("UTAPI: Error deleting files", error);
  }
};


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
        
      },
    });
  
    redirect("/dashboard/banner");
  }
  
  export async function deleteBanner(formData: FormData) {
    
    const user = await currentUser()
    if (!user ) throw new Error("Unauthorized");
   
    if(user.publicMetadata.role !== "admin") throw new Error("Unauthorized");
    
  
    await prisma.banner.delete({
      where: {
        id: formData.get("bannerId") as string,
      },

    });
    console.log(formData.get("bannerId"))
    await deleteUTFiles([formData.get("bannerId") as string]);
  
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
  
    redirect("/dashboard/packages");
  }
export async function deleteTravelPackage(formData: FormData) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.publicMetadata.role !== "admin") throw new Error("Unauthorized");

  const packageId = formData.get("packageId") as string;

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






  


