import { Router } from 'express';
import { getDeliveryFees } from '../controllers/delivery-fees-controller.js';

export const deliveryFeesRouter = Router();

deliveryFeesRouter.get('/delivery-fees', getDeliveryFees);
