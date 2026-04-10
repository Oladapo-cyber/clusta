import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../types/api.js';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

const extractBearerToken = (req: Request): string | null => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim() || null;
};

export const userAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token = extractBearerToken(req);
  if (!token) {
    next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    next(new AppError('Invalid or expired session', 401, 'AUTH_INVALID'));
    return;
  }

  (req as AuthenticatedRequest).user = {
    id: data.user.id,
    email: data.user.email ?? '',
  };

  next();
};