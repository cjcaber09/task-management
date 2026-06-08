import type { Request, Response } from "express";
import { authenticateUser } from "../models/users.model";
import { generateToken } from "../services/AuthServices";
import { ErrorResponse } from "../types/users.type";

export const login = async (req: Request, res: Response) => {
  try {
    // login logic here
    const { email, password } = req.body;
    // authenticate user and generate token
    const user = await authenticateUser({ email, password });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    if (user) {
      const token = generateToken(
        {
          guid: user.guid,
          email: user.email,
          name: user.name,
          company_guid: user.company_guid,
        },
        process.env.JWT_SECRET || "secret",
        "1d",
      );
      res.json({ user, token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error: ErrorResponse | any) {
    res.status(500).json({ error: error.message || String(error) });
  }
};

export const logout = async (req: Request, res: Response) => {
  // logout logic here
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(400).json({ error: "No token provided" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  // refresh token logic here
};

export const forgotPassword = async (req: Request, res: Response) => {
  // forgot password logic here
};

export const resetPassword = async (req: Request, res: Response) => {
  // reset password logic here
};
