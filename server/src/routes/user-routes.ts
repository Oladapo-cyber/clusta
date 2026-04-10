import { Router } from 'express';
import { getMyProfile, putMyProfile } from '../controllers/user-controller.js';
import { userAuth } from '../middleware/user-auth.js';

export const userRouter = Router();

userRouter.get('/users/me', userAuth, getMyProfile);
userRouter.put('/users/me', userAuth, putMyProfile);