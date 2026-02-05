import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshSessionController,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
  '/auth/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/auth/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/auth/logout', ctrlWrapper(logoutController));

router.get('/auth/session', ctrlWrapper(refreshSessionController));

router.post(
  '/auth/forgot-password',
  validateBody(forgotPasswordSchema),
  ctrlWrapper(forgotPasswordController),
);

router.post(
  '/auth/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
