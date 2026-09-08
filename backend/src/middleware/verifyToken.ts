import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import type { ExtendedRequest } from '../interfaces/request.types';
import { pool } from '../config/db';

const authenticateRequest = async (req: ExtendedRequest): Promise<boolean> => {
  const token = req.cookies.token;
  if (!token) return false;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const decoded = jwt.verify(token, secret) as { id?: number };
  const userId = Number(decoded.id);
  if (!Number.isSafeInteger(userId) || userId <= 0) return false;

  // Read the current role so role revocation takes effect immediately.
  const { rows } = await pool.query<{ id: number; username: string; email: string; is_admin: boolean }>(
    'SELECT id, username, email, is_admin FROM users WHERE id = $1',
    [userId]
  );
  const user = rows[0];
  if (!user) return false;

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.is_admin,
  };
  return true;
};

export const verifyToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!(await authenticateRequest(req))) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    console.error('Authentication configuration error');
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const optionalVerifyToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    next();
    return;
  }

  try {
    if (!(await authenticateRequest(req))) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    console.error('Authentication configuration error');
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
