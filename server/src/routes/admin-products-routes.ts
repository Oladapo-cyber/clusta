import { Router } from 'express';
import multer from 'multer';
import { adminAuth } from '../middleware/admin-auth.js';
import {
  deleteAdminProduct,
  getAdminProduct,
  getAdminProducts,
  postAdminProductImageUpload,
  postAdminProduct,
  putAdminProduct,
} from '../controllers/admin-products-controller.js';

export const adminProductsRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

adminProductsRouter.use(adminAuth);
adminProductsRouter.get('/admin/products', getAdminProducts);
adminProductsRouter.get('/admin/products/:id', getAdminProduct);
adminProductsRouter.post('/admin/products/upload-image', upload.single('image'), postAdminProductImageUpload);
adminProductsRouter.post('/admin/products', postAdminProduct);
adminProductsRouter.put('/admin/products/:id', putAdminProduct);
adminProductsRouter.delete('/admin/products/:id', deleteAdminProduct);