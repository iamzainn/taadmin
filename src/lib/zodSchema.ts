import { z } from "zod";


export const bannerSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  imageString: z.string(),
  for : z.string(),
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




export const visaSchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  requiredDocuments: z.string().min(1, "Required documents are required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  pricing: z.coerce.number().int().positive("Pricing must be a positive integer"),
  visaValidity: z.coerce.number().int().positive("Visa validity must be a positive integer"),
  agentId: z.string().min(1, "Agent is required"),
});
export type VisaSchemaType = z.infer<typeof visaSchema>;


export const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export type AgentSchemaType = z.infer<typeof agentSchema>;

export interface ActionResult {
  status: 'success' | 'error';
  message: string;
}



export const umrahPackageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  hotelMakkah: z.string().min(1, "Hotel in Makkah is required"),
  hotelMakkahRating: z.number().int().min(1).max(5),
  hotelMadinah: z.string().min(1, "Hotel in Madinah is required"),
  hotelMadinahRating: z.number().int().min(1).max(5),
  nightsInMakkah: z.number().int().min(1, "At least one night in Makkah is required"),
  nightsInMadinah: z.number().int().min(1, "At least one night in Madinah is required"),
  transportation: z.boolean(),
  price: z.number().min(1, "Price must be at least 1"),
  image: z.string().optional(),
  inclusions: z.array(z.string()).min(1, "At least one inclusion is required"),
});

export type UmrahPackageSchemaType = z.infer<typeof umrahPackageSchema>;