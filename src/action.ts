"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import {  bannerSchema} from "../src/lib/zodSchema";
import prisma from "./lib/db";
import { currentUser } from "@clerk/nextjs/server";



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
  
    redirect("/dashboard/banner");
  }