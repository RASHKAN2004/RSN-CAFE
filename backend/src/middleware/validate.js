import { AppError } from '../utils/AppError.js';

export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(new AppError(400, result.error.issues[0].message));
    req[source] = result.data;
    next();
  };
