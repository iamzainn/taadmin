import { z } from "zod";







export const bannerSchema = z.object({
  title: z.string(),
  imageString: z.string(),
});