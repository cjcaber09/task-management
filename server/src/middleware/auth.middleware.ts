// validate user middleware
import { Request, Response, NextFunction } from "express";
import { RegisterUserInput, LoginUserInput } from "../types/shared.types";
import { authenticateUser } from "../models/users.model";
import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: {
        guid: string;
        company_guid: string;
        [key: string]: any; // Allow additional properties from the token payload
      };
    }
  }
}

export const validateRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password, confirmPassword, userInfo } =
    req.body as RegisterUserInput;
  if (!email || !password || !confirmPassword || !userInfo) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match" });
    return;
  }
  next();
};

// Authentication middleware to validate login user input
export const validateLoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body as LoginUserInput;
  if (!email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const user = await authenticateUser({ email, password });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  if (user.deleted_at) {
    res.status(403).json({ error: "User account is deleted" });
    return;
  }
  next();
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (typeof decoded === "string") {
      res.status(403).json({ error: "Invalid token payload" });
      return;
    }
    console.log("Decoded token:", decoded);
    // Support both legacy `userId` and current `guid` claims.
    req.user = {
      ...decoded,
      guid: (decoded as any).guid || (decoded as any).userId,
      company_guid: (decoded as any).company_guid,
    };
    console.log("Authenticated user:", req.user);
    if (!req.user.guid) {
      res.status(403).json({ error: "Token missing user guid" });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};
