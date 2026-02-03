import { Router } from 'express';
import {
  getNoteByIdController,
  getNotesController,
} from '../controllers/notes.js';

const router = Router();

router.get('/notes', getNotesController);
router.get('/notes/:noteId', getNoteByIdController);

export default router;
