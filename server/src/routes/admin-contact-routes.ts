import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import { getAdminContactInquiries, putAdminContactInquiry } from '../controllers/admin-contact-controller.js';

export const adminContactRouter = Router();

adminContactRouter.use(adminAuth);
adminContactRouter.get('/admin/contact', getAdminContactInquiries);
adminContactRouter.put('/admin/contact/:id', putAdminContactInquiry);