import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;

export const loginFormSchemaDefaultValues: TLoginFormSchema = {
  email: "",
  password: "",
};
