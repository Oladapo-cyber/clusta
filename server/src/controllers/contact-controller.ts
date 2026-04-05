import type { Request, Response } from 'express';
import { z } from 'zod';
import { createContactInquiry } from '../services/contact-service.js';

const createInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

export const postContactInquiry = async (req: Request, res: Response): Promise<void> => {
  const payload = createInquirySchema.parse(req.body);
  const inquiry = await createContactInquiry(payload);
  res.status(201).json({ success: true, data: inquiry });
};