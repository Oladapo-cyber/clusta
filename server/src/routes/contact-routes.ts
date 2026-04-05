import { Router } from 'express';
import { postContactInquiry } from '../controllers/contact-controller.js';

export const contactRouter = Router();

contactRouter.post('/contact/inquiries', postContactInquiry);