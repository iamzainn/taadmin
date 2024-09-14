
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {  currentUser } from '@clerk/nextjs/server'


 
const f = createUploadthing();
 


export const ourFileRouter = {
    bannerImageRoute: f({ image: { maxFileSize: "8MB",maxFileCount:1 } })
    
    .middleware(async ({ }) => {
  
        const user = await currentUser()
        if (!user ) throw new UploadThingError("Unauthorized");
       
        if(user.publicMetadata.role !== "admin") throw new UploadThingError("Unauthorized");
    
        
     
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
     
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
 
     
      return { uploadedBy: metadata.userId };
    }),
    packageImageRoute: f({ image: { maxFileSize: "4MB",maxFileCount:5 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ }) => {
  
      const user = await currentUser()
      if (!user ) throw new UploadThingError("Unauthorized");
     
      if(user.publicMetadata.role !== "admin") throw new UploadThingError("Unauthorized");
  
      
   
    return { userId: user.id };
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;