import type { CorsOptions } from 'cors';
import type { NextFunction, Request, Response } from 'express';

const DEVELOPMENT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

export const getAllowedOrigins = (): string[] => {
  const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL ||
    (process.env.SERVE_FRONTEND === 'true' ? process.env.RENDER_EXTERNAL_URL : '') || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('FRONTEND_URL or FRONTEND_URLS must be configured in production');
  }

  return DEVELOPMENT_ORIGINS;
};

export const getPrimaryFrontendUrl = (): string => getAllowedOrigins()[0];

export const validateSecurityConfig = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET must be configured');
  }
  if (process.env.NODE_ENV === 'production' && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }

  getAllowedOrigins();
};

export const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  return getAllowedOrigins().includes(origin.replace(/\/$/, ''));
};

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const requireTrustedOrigin = (req: Request, res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({ message: 'Untrusted request origin' });
    return;
  }

  next();
};
