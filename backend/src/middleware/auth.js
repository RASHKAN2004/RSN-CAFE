import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) throw new AppError(401, 'Please log in to continue.');
  let payload;
  try {
    payload = jwt.verify(header.slice(7), env.jwtSecret);
  } catch {
    throw new AppError(401, 'Your session has expired. Please log in again.');
  }
  const user = await User.findById(payload.id);
  if (!user || !user.isVerified) throw new AppError(401, 'Account not found. Please log in again.');
  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : next(new AppError(403, 'You do not have permission to do that.'));

export const staffOnly = restrictTo('admin', 'staff');
export const adminOnly = restrictTo('admin');
