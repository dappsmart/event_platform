import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import User from '@/lib/database/models/user.model'
import { headers } from 'next/headers'

 
const f = createUploadthing();

// const { sessionClaims } = auth();

//   const userId = sessionClaims?.userId as string;

// const auth = (req: Request) => ({ id : userId }); // Fake auth function




// const { sessionClaims } = auth(); 

// const userId = sessionClaims?.userId as string;


// const headerPayload = headers();
// const svix_id = headerPayload.get("svix-id");

// const payload = await req.json()
//   const body = JSON.stringify(payload);



//const userId = svix_id //user._id//User.findById({id: user})


const identity = (req: Request) => ({ id : "fakeId" });
 

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      
      const user = await identity(req);
    
 
      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
      console.log("uploadedBy:", metadata.userId)
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;


