import { z } from "zod";
const membersSchema = z.object({
  members: z
    .array(
      z
        .object({
          email: z
            .string()
            .email({ message: "Invalid email address" })
            .min(1, { message: "Email is required" }),
          user_guid: z
            .string()
            .trim()
            .min(1, { message: "User guid is required" })
            .optional(),
        })
        .refine((member) => member.email || member.user_guid, {
          message: "Provide either email or user guid",
        }),
    )
    .min(1, { message: "Members array cannot be empty" }),
});

export { membersSchema };
