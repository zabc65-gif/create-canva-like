import { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@create/shared';

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';

  const errorResponse: { success: false; error: ApiError } = {
    success: false,
    error: {
      code,
      message: err.message || 'Une erreur est survenue',
    },
  };

  res.status(statusCode).json(errorResponse);
}
