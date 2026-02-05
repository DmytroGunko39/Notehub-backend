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

router.get('/notes', ctrlWrapper(getNotesController));

router.post(
  '/notes',
  validateBody(createNoteSchema),
  ctrlWrapper(createNoteController),
);

router.get(
  '/notes/:noteId',
  isValidId('noteId'),
  ctrlWrapper(getNoteByIdController),
);

router.patch(
  '/notes/:noteId',
  isValidId('noteId'),
  validateBody(updateNoteSchema),
  ctrlWrapper(updateNoteController),
);

router.delete(
  '/notes/:noteId',
  isValidId('noteId'),
  ctrlWrapper(deleteNoteController),
);

export default router;
