import type { Request, Response } from 'express';
import { z } from 'zod';
import { listDeliveryFeesAdmin, updateDeliveryFeeByLocation } from '../services/delivery-fee-service.js';

const updateDeliveryFeeSchema = z.object({
  location: z.enum(['Mainland', 'Island']),
  fee_kobo: z.number().int().nonnegative(),
});

export const getAdminDeliveryFees = async (_req: Request, res: Response): Promise<void> => {
  const rows = await listDeliveryFeesAdmin();
  res.status(200).json({ success: true, data: rows });
};

export const putAdminDeliveryFee = async (req: Request, res: Response): Promise<void> => {
  const payload = updateDeliveryFeeSchema.parse(req.body);
  const row = await updateDeliveryFeeByLocation(payload.location, payload.fee_kobo);
  res.status(200).json({ success: true, data: row });
};
