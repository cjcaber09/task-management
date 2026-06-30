import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
  });
