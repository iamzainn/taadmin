import { z } from "zod";


export const bannerSchema = z.object({
  title: z.string(),
  imageString: z.string(),
});

export const travelPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  durationInDays: z.number().min(1, "Duration must be at least 1 day"),
  departureCity: z.string().min(1, "Departure city is required"),
  arrivalCity: z.string().min(1, "Arrival city is required"),
  dailyDetails: z.array(z.string().min(1, "Daily detail is required")).min(1, "At least one daily detail is required"),
  overview: z.string().min(10, "Overview must be at least 10 characters long"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  price: z.number().min(1, "Price must be at least 1"),
});