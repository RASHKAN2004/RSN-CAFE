import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) =>
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists.`;
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID or value.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body.';
  } else if (status >= 500) {
    console.error(err);
    if (env.isProd) message = 'Something went wrong on our side.';
  }
  res.status(status).json({ message, ...(err.extra || {}) });
}
