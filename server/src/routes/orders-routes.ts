import { Router } from 'express';
import { postAuthenticatedOrder, postOrder } from '../controllers/orders-controller.js';
import { userAuth } from '../middleware/user-auth.js';

export const ordersRouter = Router();

ordersRouter.post('/orders', postOrder);
ordersRouter.post('/orders/authenticated', userAuth, postAuthenticatedOrder);
