import * as notesService from '../services/notes.service.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await notesService.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const note = await notesService.createNote(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await notesService.updateNote(req.params.id, req.body);
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await notesService.deleteNote(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
