import type { RequestHandler } from 'express';
import { z } from 'zod';

export const positiveId = z.coerce.number().int().positive().max(2147483647);
export const validateBody = (schema: z.ZodType): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') });
    return;
  }
  req.body = result.data;
  next();
};
export const validateId = (name = 'id'): RequestHandler => (req, res, next) => {
  if (!positiveId.safeParse(req.params[name]).success) {
    res.status(400).json({ message: `Invalid ${name}` });
    return;
  }
  next();
};
