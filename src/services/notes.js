import NotesCollection from '../db/models/note.js';

export const getNotes = async (
  userId,
  { search, tag, page = 1, perPage = 10 },
) => {
  const filter = { userId };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (tag) {
    filter.tag = tag;
  }

  const skip = (page - 1) * perPage;

  const [notes, totalItems] = await Promise.all([
    NotesCollection.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 }),
    NotesCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: notes,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getNoteById = async (noteId, userId) => {
  return await NotesCollection.findOne({ _id: noteId, userId });
};

export const createNote = async (noteData) => {
  return await NotesCollection.create(noteData);
};

export const updateNote = async (noteId, userId, updateData) => {
  return await NotesCollection.findOneAndUpdate(
    { _id: noteId, userId },
    updateData,
    { new: true, runValidators: true },
  );
};

export const deleteNote = async (noteId, userId) => {
  return await NotesCollection.findOneAndDelete({ _id: noteId, userId });
};
