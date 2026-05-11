import { Note } from '../models/index.js';

export const getAllNotes = async () => {
  return await Note.findAll({
    order: [['created_at', 'ASC']],
  });
};

export const createNote = async (noteData) => {
  return await Note.create(noteData);
};

export const updateNote = async (id, noteData) => {
  const note = await Note.findByPk(id);
  if (!note) {
    throw new Error('Note not found');
  }
  return await note.update(noteData);
};

export const deleteNote = async (id) => {
  const note = await Note.findByPk(id);
  if (!note) {
    throw new Error('Note not found');
  }
  return await note.destroy();
};
