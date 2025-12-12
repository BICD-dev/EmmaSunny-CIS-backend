// utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

// dotenv.config()
export const JWT_SECRET: string | undefined = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}
interface JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

export const generateToken = (
  payload: JwtPayload,
  expiresIn: number = 3600*3
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};