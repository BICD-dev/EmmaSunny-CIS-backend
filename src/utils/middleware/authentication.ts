import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

interface JWTPayload {
  id: string;
  email?: string;
  role?: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'Internal server error. JWT secret not configured.',
      });
      return;
    }
    // validate if the officer is inactive
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Attach user data to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

// Optional: Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Please authenticate first.',
      });
      return;
    }

    if (roles.length && !roles.includes(req.user.role || '')) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
      return;
    }

    next();
  };
};