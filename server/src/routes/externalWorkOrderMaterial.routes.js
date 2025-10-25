import express from 'express';
import ExternalWorkOrderMaterialController from '../controllers/externalWorkOrderMaterial.controller.js';

const router = express.Router();

router.get('/', ExternalWorkOrderMaterialController.getAll);
router.post('/', ExternalWorkOrderMaterialController.create);
router.delete('/:id', ExternalWorkOrderMaterialController.delete);

export default router;