import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../services/notes.js';
import createHttpError from 'http-errors';

export const getNotesController = async (req, res) => {
  const { search, tag, page, perPage } = req.query;
  const result = await getNotes(req.user._id, {
    search,
    tag,
    page: page ? Number(page) : 1,
    perPage: perPage ? Number(perPage) : 10,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found notes!',
    data: result.data,
    page: result.page,
    perPage: result.perPage,
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
  });
};

export const getNoteByIdController = async (req, res) => {
  const { noteId } = req.params;
  const note = await getNoteById(noteId, req.user._id);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.json({
    status: 200,
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};

export const createNoteController = async (req, res) => {
  const { title, content, tag } = req.body;
  const note = await createNote({
    title,
    content,
    tag,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Note created successfully',
    data: note,
  });
};

export const updateNoteController = async (req, res) => {
  const { noteId } = req.params;
  const { title, content, tag } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (tag !== undefined) updateData.tag = tag;

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'No fields to update');
  }

  const note = await updateNote(noteId, req.user._id, updateData);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Note updated successfully',
    data: note,
  });
};

export const deleteNoteController = async (req, res) => {
  const { noteId } = req.params;
  const note = await deleteNote(noteId, req.user._id);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(204).send();
};
