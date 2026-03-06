import { z } from "zod";
import { Gender } from "@shared/types";

const MIN_AGE = 18;

function isAtLeast18(dateStr: string): boolean {
  if (!dateStr) return true;
  const dob = new Date(dateStr);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= MIN_AGE;
  }
  return age >= MIN_AGE;
}

export const registerFormSchema = z
  .object({
    nationalNo: z.string().min(10).max(20),
    firstName: z.string().min(2),
    secondName: z.string().min(2),
    thirdName: z.string().min(2),
    lastName: z.string().min(2),
    dateOfBirth: z
      .string()
      .min(1)
      .refine((val) => isAtLeast18(val), {
        message: "Person must be at least 18 years old",
      }),
    gender: z.enum([String(Gender.Male), String(Gender.Female)]),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type TRegisterFormSchema = z.infer<typeof registerFormSchema>;

export const registerFormSchemaDefaultValues: TRegisterFormSchema = {
  nationalNo: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  dateOfBirth: "",
  gender: String(Gender.Male),
  email: "",
  password: "",
  confirmPassword: "",
};
