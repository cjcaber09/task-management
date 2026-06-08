import { z } from "zod";
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    userInfo: z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>;
    companyInfo: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type login = z.infer<typeof loginUserSchema>;
export type register = z.infer<typeof createUserSchema>;
//# sourceMappingURL=userSchema.d.ts.map