import express from 'express';
import { shutdown, restart } from '../controllers/system.controller.js';

const router = express.Router();

router.post('/shutdown', shutdown);
router.post('/restart', restart);
router.get('/test', (req, res) => res.json({ ok: true }));


export default router;
