import type { Request, Response } from 'express';
import { z } from 'zod';
import { listOrdersAdmin, getOrderByIdAdmin, markOrderCompleted } from '../services/order-service.js';

const idSchema = z.string().uuid();

export const getAdminOrders = async (_req: Request, res: Response): Promise<void> => {
  const rows = await listOrdersAdmin();
  res.status(200).json({ success: true, data: rows });
};

export const getAdminOrder = async (req: Request, res: Response): Promise<void> => {
  const id = idSchema.parse(req.params.id);
  const row = await getOrderByIdAdmin(id);
  res.status(200).json({ success: true, data: row });
};

export const putAdminOrderComplete = async (req: Request, res: Response): Promise<void> => {
  const id = idSchema.parse(req.params.id);
  const row = await markOrderCompleted(id);
  res.status(200).json({ success: true, data: row });
};