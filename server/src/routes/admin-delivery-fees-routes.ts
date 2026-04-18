import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import { getAdminDeliveryFees, putAdminDeliveryFee } from '../controllers/admin-delivery-fees-controller.js';

export const adminDeliveryFeesRouter = Router();

adminDeliveryFeesRouter.use(adminAuth);
adminDeliveryFeesRouter.get('/admin/delivery-fees', getAdminDeliveryFees);
adminDeliveryFeesRouter.put('/admin/delivery-fees', putAdminDeliveryFee);
