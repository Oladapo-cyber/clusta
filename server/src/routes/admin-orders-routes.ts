import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import { getAdminOrder, getAdminOrders, putAdminOrderComplete } from '../controllers/admin-orders-controller.js';

export const adminOrdersRouter = Router();

adminOrdersRouter.use(adminAuth);
adminOrdersRouter.get('/admin/orders', getAdminOrders);
adminOrdersRouter.get('/admin/orders/:id', getAdminOrder);
adminOrdersRouter.put('/admin/orders/:id/complete', putAdminOrderComplete);