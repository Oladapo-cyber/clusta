import type { Request, Response } from 'express';
import { z } from 'zod';
import { createClustaCareResult } from '../services/clustacare-service.js';

const createResultSchema = z.object({
  test_result: z.enum(['positive', 'negative', 'invalid']),
  whatsapp_number: z.string().min(7).max(30).optional(),
});

export const postClustaCareResult = async (req: Request, res: Response): Promise<void> => {
  const payload = createResultSchema.parse(req.body);
  const result = await createClustaCareResult(payload);
  res.status(201).json({ success: true, data: result });
};