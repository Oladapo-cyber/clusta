import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { AppError } from '../types/api.js';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof MulterError) {
    const isTooLarge = err.code === 'LIMIT_FILE_SIZE';
    res.status(isTooLarge ? 413 : 400).json({
      success: false,
      error: {
        message: isTooLarge ? 'Image must be 5MB or smaller' : err.message,
        code: isTooLarge ? 'IMAGE_TOO_LARGE' : 'UPLOAD_INVALID',
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Unexpected server error';
  res.status(500).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
