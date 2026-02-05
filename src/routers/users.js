import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getMeController, updateMeController } from '../controllers/users.js';
import { updateUserSchema } from '../validation/users.js';

const router = Router();

router.use(authenticate);

router.get('/users/me', ctrlWrapper(getMeController));

router.patch(
  '/users/me',
  validateBody(updateUserSchema),
  ctrlWrapper(updateMeController),
);

export default router;
