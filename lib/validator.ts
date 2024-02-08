import { z } from "zod"


export const eventFormSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(3, {message: "Description must be at least 3 characters"}).max(400, {message: "Description must be maximum of 400 characters long."}),
    location: z.string().min(3, {message: "Location must be at least 3 characters"}).max(400, {message: "Location must be maximum of 400 characters long."}),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
    
  })