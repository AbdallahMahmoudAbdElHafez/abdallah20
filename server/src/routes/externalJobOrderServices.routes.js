import express from 'express';
import ExternalJobOrderServicesController from '../controllers/externalJobOrderServices.controller.js';

const router = express.Router();

router.get('/', ExternalJobOrderServicesController.getAll);
router.post('/', ExternalJobOrderServicesController.create);
router.delete('/:id', ExternalJobOrderServicesController.remove);

export default router;
