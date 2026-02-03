import NotesCollection from '../db/models/note.js';

export const getNotes = async () => {
  return await NotesCollection.find();
};

export const getNoteById = async (id) => {
  return await NotesCollection.findById(id);
};
