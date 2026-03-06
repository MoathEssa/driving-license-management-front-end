import { z } from "zod";

export const testTypeSchema = z.object({
  testTypeTitle: z.string().min(1).max(100),
  testTypeDescription: z.string().max(500).optional().or(z.literal("")),
  testTypeFees: z.coerce.number().min(0),
});

export type TTestTypeSchema = z.infer<typeof testTypeSchema>;
