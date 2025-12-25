// src/middleware/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Creates a rate limit middleware based on IP address
 * @param minutes - Time window in minutes
 * @param maxAttempts - Maximum number of requests allowed in the time window
 * @returns Rate limit middleware
 */
export const createRateLimiter = (minutes: number, maxAttempts: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000, // Convert minutes to milliseconds
    max: maxAttempts,
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
      status: false,
      message: `Too many requests. Please try again after ${minutes} minute(s).`,
    },
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        status: false,
        code: 429,
        message: `Too many requests from this IP. Please try again after ${minutes} minute(s).`,
      });
    },
    // Optional: Skip rate limiting for certain IPs (e.g., internal servers)
    skip: (req: Request) => {
      // Example: Skip rate limiting for localhost in development
      // return process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1';
      return false;
    },
  });
};

// Pre-configured common limiters (optional)
export const strictLimiter = createRateLimiter(15, 5);   // 5 requests per 15 minutes
export const moderateLimiter = createRateLimiter(15, 10); // 10 requests per 15 minutes
export const relaxedLimiter = createRateLimiter(60, 100); // 100 requests per hour
export const loginLimiter = createRateLimiter(15, 5);     // 5 login attempts per 15 minutes
export const downloadLimiter = createRateLimiter(15, 10); // 10 downloads per 15 minutes