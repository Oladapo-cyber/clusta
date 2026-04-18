import type { Request, Response } from 'express';
import { listActiveDeliveryFees } from '../services/delivery-fee-service.js';

export const getDeliveryFees = async (_req: Request, res: Response): Promise<void> => {
  const rows = await listActiveDeliveryFees();
  res.status(200).json({ success: true, data: rows });
};
