import express from "express";
import {
  createUserSchema,
  loginUserSchema,
} from "../../../../shared/schema/userSchema";
import { membersSchema } from "./schema/MembersSchema";
import { updatePasswordSchema } from "./schema/UsersSchema";

const validationHandler = (schema: any) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const result = await schema.safeParseAsync(req.body);
    if (result.success) {
      next();
    } else {
      res.status(400).json({
        errors: JSON.parse(JSON.stringify(result.error.issues)).map(
          (issue: any) => ({
            message: issue.message,
          }),
        ),
      });
    }
  };
};

export const validateCreateUser = validationHandler(createUserSchema);
export const validateLoginUser = validationHandler(loginUserSchema);
export const validateAddMembers = validationHandler(membersSchema);
export const validateUpdatePassword = validationHandler(updatePasswordSchema);
export default {
  validateCreateUser,
  validateLoginUser,
  validateAddMembers,
  validateUpdatePassword,
};
