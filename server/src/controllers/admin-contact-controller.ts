import type { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../types/api.js';
import { listContactInquiries, updateContactInquiry } from '../services/contact-service.js';

const idSchema = z.string().uuid();
const updateSchema = z
  .object({
    status: z.enum(['new', 'in_progress', 'resolved', 'spam']).optional(),
    admin_notes: z.string().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export const getAdminContactInquiries = async (_req: Request, res: Response): Promise<void> => {
  const rows = await listContactInquiries();
  res.status(200).json({ success: true, data: rows });
};

export const putAdminContactInquiry = async (req: Request, res: Response): Promise<void> => {
  const id = idSchema.parse(req.params.id);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? 'Invalid payload', 400, 'CONTACT_UPDATE_INVALID');
  }

  const row = await updateContactInquiry(id, parsed.data);
  res.status(200).json({ success: true, data: row });
};