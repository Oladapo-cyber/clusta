import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middleware/user-auth.js';
import { ensureUserProfile, updateUserProfile } from '../services/profile-service.js';

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(150).nullable().optional(),
  phone: z.string().min(7).max(30).nullable().optional(),
  delivery_address: z.string().min(5).max(300).nullable().optional(),
  delivery_location: z.string().min(2).max(120).nullable().optional(),
});

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const profile = await ensureUserProfile(authReq.user.id, authReq.user.email);
  res.status(200).json({ success: true, data: profile });
};

export const putMyProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const payload = updateProfileSchema.parse(req.body);
  const profile = await updateUserProfile(authReq.user.id, authReq.user.email, payload);
  res.status(200).json({ success: true, data: profile });
};