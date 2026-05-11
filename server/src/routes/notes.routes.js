import express from 'express';
import * as notesController from '../controllers/notes.controller.js';

const router = express.Router();

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

export default router;
