
import express from 'express';
import { getDatabases, backup, switchDb, verifyPassword } from '../controllers/database.controller.js';

const router = express.Router();

router.get('/list', getDatabases);
router.post('/backup', backup);
router.post('/switch', switchDb);
router.post('/verify', verifyPassword);

export default router;
