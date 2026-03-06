import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "required" })
    .email({ message: "invalidEmail" }),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: TForgotPasswordSchema = {
  email: "",
};
