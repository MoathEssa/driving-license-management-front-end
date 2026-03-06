import { z } from "zod";

export const applicationTypeSchema = z.object({
  applicationTypeTitle: z.string().min(1).max(100),
  applicationFees: z.coerce.number().min(0),
});

export type TApplicationTypeSchema = z.infer<typeof applicationTypeSchema>;
