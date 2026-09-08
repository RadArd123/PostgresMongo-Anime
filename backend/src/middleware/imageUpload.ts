import fileUpload, { type UploadedFile } from 'express-fileupload';
import type { NextFunction, Request, Response } from 'express';
import { open, unlink } from 'fs/promises';
import path from 'path';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const imageUpload = fileUpload({
  useTempFiles: true,
  tempFileDir: path.resolve(process.cwd(), 'uploads'),
  createParentPath: true,
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
  uploadTimeout: 30_000,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: 2,
    fields: 20,
    parts: 24,
  },
});

const collectUploadedFiles = (req: Request): UploadedFile[] => {
  if (!req.files) return [];

  return Object.values(req.files).flatMap((entry) =>
    Array.isArray(entry) ? entry : [entry]
  );
};

export const cleanupUploadTempFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = collectUploadedFiles(req);
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;

    void Promise.all(
      files
        .filter((file) => Boolean(file.tempFilePath))
        .map((file) => unlink(file.tempFilePath).catch(() => undefined))
    );
  };

  res.once('finish', cleanup);
  res.once('close', cleanup);
  next();
};

const detectImageType = (header: Buffer): string | null => {
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return 'image/jpeg';
  }
  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (header.subarray(0, 4).toString('ascii') === 'RIFF' && header.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }
  const gifHeader = header.subarray(0, 6).toString('ascii');
  if (gifHeader === 'GIF87a' || gifHeader === 'GIF89a') {
    return 'image/gif';
  }
  return null;
};

export const validateImageUploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    for (const file of collectUploadedFiles(req)) {
      if (file.size <= 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
        res.status(413).json({ message: 'Each image must be between 1 byte and 10 MB' });
        return;
      }

      const handle = await open(file.tempFilePath, 'r');
      const header = Buffer.alloc(12);
      try {
        await handle.read(header, 0, header.length, 0);
      } finally {
        await handle.close();
      }

      const detectedType = detectImageType(header);
      const declaredType = file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype;
      if (!detectedType || !ALLOWED_IMAGE_TYPES.has(declaredType) || detectedType !== declaredType) {
        res.status(415).json({ message: 'Only valid JPEG, PNG, WebP, or GIF images are accepted' });
        return;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
