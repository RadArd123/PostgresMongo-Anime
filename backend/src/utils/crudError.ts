import type { Response } from 'express';

export function crudError(res: Response, error: unknown, fallback: string) {
  const code = (error as { code?: string })?.code;
  if (code === '23505') return res.status(409).json({ message: 'A record with these details already exists.' });
  if (code === '23503') return res.status(409).json({ message: 'A linked record is missing or still in use. Refresh and try again.' });
  console.error(fallback, error);
  return res.status(500).json({ message: fallback });
}
