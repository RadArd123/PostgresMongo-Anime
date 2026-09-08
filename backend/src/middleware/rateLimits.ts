import { rateLimit } from 'express-rate-limit';

const sharedOptions = {
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
};

export const apiLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { message: 'Too many requests. Please try again later.' },
});

export const authLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

export const checkoutLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many checkout attempts. Please try again later.' },
});

export const uploadLimiter = rateLimit({
  ...sharedOptions,
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: { message: 'Too many upload attempts. Please try again later.' },
});
