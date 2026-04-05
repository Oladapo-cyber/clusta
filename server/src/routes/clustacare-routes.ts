import { Router } from 'express';
import { postClustaCareResult } from '../controllers/clustacare-controller.js';

export const clustacareRouter = Router();

clustacareRouter.post('/clustacare/results', postClustaCareResult);