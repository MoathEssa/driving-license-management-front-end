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

export const personFormSchema = z.object({
  nationalNo: z.string().min(1, { message: "required" }).max(20),
  firstName: z.string().min(1, { message: "required" }).max(50),
  secondName: z.string().max(50).optional().or(z.literal("")),
  thirdName: z.string().max(50).optional().or(z.literal("")),
  lastName: z.string().min(1, { message: "required" }).max(50),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || isAtLeast18(val), {
      message: "Person must be at least 18 years old",
    }),
  gender: z
    .enum([String(Gender.Male), String(Gender.Female)])
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email format",
    }),
  phone: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
});

export type TPersonFormSchema = z.infer<typeof personFormSchema>;

export const personFormDefaultValues: TPersonFormSchema = {
  nationalNo: "",
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
};
