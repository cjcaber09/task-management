"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// For the meantime create schema on shared folder, we can move it to server/frontend later when we have more schemas and types
exports.createUserSchema = zod_1.z
    .object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
    password: zod_1.z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: zod_1.z
        .string({ message: "Confirm Password is required" })
        .min(6, {
        message: "Confirm Password must be at least 6 characters long",
    }),
    userInfo: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
    }),
    companyInfo: zod_1.z
        .object({
        name: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Company name is required" })
            .optional(),
        guid: zod_1.z
            .string()
            .trim()
            .min(1, { message: "Company guid is required" })
            .optional(),
    })
        .refine((company) => Boolean(company.name) || Boolean(company.guid), {
        message: "Provide either company name or company guid",
        path: ["name"],
    })
        .refine((company) => !(company.name && company.guid), {
        message: "Provide only one: company name or company guid",
        path: ["guid"],
    })
        .optional(),
})
    .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
//# sourceMappingURL=userSchema.js.map