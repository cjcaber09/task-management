import { z } from "zod";

// For the meantime create schema on shared folder, we can move it to server/frontend later when we have more schemas and types

export const createUserSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(6, {
        message: "Confirm Password must be at least 6 characters long",
      }),
    userInfo: z.object({
      name: z.string().min(1, { message: "Name is required" }),
    }),
    companyInfo: z
      .object({
        name: z.string().min(1, { message: "Company name is required" }),
      })
      .optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type login = z.infer<typeof loginUserSchema>;

export type register = z.infer<typeof createUserSchema>;
