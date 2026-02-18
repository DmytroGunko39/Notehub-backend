import { Router } from 'express';
import {
  getNoteByIdController,
  getNotesController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} from '../controllers/notes.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createNoteSchema, updateNoteSchema } from '../validation/notes.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getNotesController));

router.post(
  '/',
  validateBody(createNoteSchema),
  ctrlWrapper(createNoteController),
);

router.get('/:noteId', isValidId('noteId'), ctrlWrapper(getNoteByIdController));

router.patch(
  '/:noteId',
  isValidId('noteId'),
  validateBody(updateNoteSchema),
  ctrlWrapper(updateNoteController),
);

router.delete(
  '/:noteId',
  isValidId('noteId'),
  ctrlWrapper(deleteNoteController),
);

export default router;
