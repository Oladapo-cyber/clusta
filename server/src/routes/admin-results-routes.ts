import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import { getAdminResults, putAdminResult } from '../controllers/admin-results-controller.js';

export const adminResultsRouter = Router();

adminResultsRouter.use(adminAuth);
adminResultsRouter.get('/admin/results', getAdminResults);
adminResultsRouter.put('/admin/results/:id', putAdminResult);