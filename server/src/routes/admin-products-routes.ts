import { Router } from 'express';
import { adminAuth } from '../middleware/admin-auth.js';
import {
  deleteAdminProduct,
  getAdminProduct,
  getAdminProducts,
  postAdminProduct,
  putAdminProduct,
} from '../controllers/admin-products-controller.js';

export const adminProductsRouter = Router();

adminProductsRouter.use(adminAuth);
adminProductsRouter.get('/admin/products', getAdminProducts);
adminProductsRouter.get('/admin/products/:id', getAdminProduct);
adminProductsRouter.post('/admin/products', postAdminProduct);
adminProductsRouter.put('/admin/products/:id', putAdminProduct);
adminProductsRouter.delete('/admin/products/:id', deleteAdminProduct);