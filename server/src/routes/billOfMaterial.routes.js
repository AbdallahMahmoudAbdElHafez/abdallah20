// src/routes/billOfMaterial.routes.js
import express from 'express';
import * as controller from '../controllers/billOfMaterial.controller.js';

const router = express.Router();

// مسارات CRUD
router.post('/', controller.create);            // إنشاء سطر BOM
router.get('/', controller.list);               // جلب كل السطور (قابل للتصفية ب ?product_id=)
router.get('/:id', controller.getOne);          // جلب سطر واحد
router.put('/:id', controller.update);          // تعديل
router.delete('/:id', controller.remove);       // حذف

export default router;
