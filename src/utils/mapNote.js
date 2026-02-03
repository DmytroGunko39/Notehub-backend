module.exports = (note) => ({
  id: note._id,
  title: note.title,
  content: note.content,
  tag: note.tag,
  userId: note.userId,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});
