import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = make(15 * 60 * 1000, 400, 'Too many requests. Please slow down.');
export const authLimiter = make(15 * 60 * 1000, 30, 'Too many attempts. Try again in 15 minutes.');
export const otpLimiter = make(10 * 60 * 1000, 6, 'Too many OTP requests. Try again in 10 minutes.');
