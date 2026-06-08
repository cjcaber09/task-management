import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateToken = (
  payload: object,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const invalidateToken = (token: string, secret: string) => {
  // Invalidate token logic here (e.g., add to blacklist)
};

export { hashPassword, comparePassword, invalidateToken };
