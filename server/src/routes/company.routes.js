import express from 'express';
import * as companyController from '../controllers/company.controller.js';

import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', upload.single('logo'), companyController.createCompany);
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', upload.single('logo'), companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
