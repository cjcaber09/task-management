import express from "express";
import {
  createUserSchema,
  loginUserSchema,
} from "../../../../shared/schema/userSchema";

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

export default {
  validateCreateUser,
  validateLoginUser,
};
