import express from 'express';
import offerKitsController from '../controllers/offerKits.controller.js';

const router = express.Router();

router.get('/', offerKitsController.getAllOfferKits);
router.get('/:id', offerKitsController.getOfferKitById);
router.post('/', offerKitsController.createOfferKit);
router.put('/:id', offerKitsController.updateOfferKit);
router.delete('/:id', offerKitsController.deleteOfferKit);

export default router;
