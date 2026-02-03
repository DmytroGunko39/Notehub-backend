import { getNotes, getNoteById } from '../services/notes.js';

export const getNotesController = async (req, res) => {
  const notes = await getNotes();
  res.status(200).json({
    message: 'Successfully found notes!',
    data: notes,
  });
};

export const getNoteByIdController = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await getNoteById(noteId);
  if (!note) {
    res.status(404).json({
      message: 'Note not found',
    });
    return next();
  }
  res.status(200).json({
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};
