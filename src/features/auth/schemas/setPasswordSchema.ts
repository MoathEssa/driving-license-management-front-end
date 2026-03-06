import { z } from "zod";

export const setPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "passwordMin" }),
    confirmPassword: z.string().min(1, { message: "required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMustMatch",
    path: ["confirmPassword"],
  });

export type TSetPasswordSchema = z.infer<typeof setPasswordSchema>;

export const setPasswordDefaultValues: TSetPasswordSchema = {
  password: "",
  confirmPassword: "",
};
