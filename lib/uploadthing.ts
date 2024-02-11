import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";


  import { generateReactHelpers } from "@uploadthing/react/hooks";
  export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
   
  import type { OurFileRouter } from "@/app/api/uploadthing/core";
   
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();