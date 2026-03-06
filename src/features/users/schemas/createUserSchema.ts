import { z } from "zod";

export const createUserSchema = z.object({
  personId: z.number().min(1),
  email: z
    .string()
    .min(1, { message: "required" })
    .email({ message: "invalidEmail" })
    .max(256),
  role: z.enum(["User", "Admin"]),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const createUserDefaultValues: TCreateUserSchema = {
  personId: 0,
  email: "",
  role: "User",
};
