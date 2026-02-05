// src/routes/externalServiceInvoices.routes.js
import { Router } from "express";
import ExternalServiceInvoicesController from "../controllers/externalServiceInvoices.controller.js";

const router = Router();

// CRUD endpoints
router.get("/", ExternalServiceInvoicesController.getAll);
router.get("/:id", ExternalServiceInvoicesController.getById);
router.get("/job-order/:jobOrderId", ExternalServiceInvoicesController.getByJobOrderId);
router.post("/", ExternalServiceInvoicesController.create);
router.put("/:id", ExternalServiceInvoicesController.update);
router.delete("/:id", ExternalServiceInvoicesController.remove);

// Posting and Cancellation
router.post("/:id/post", ExternalServiceInvoicesController.post);
router.post("/:id/cancel", ExternalServiceInvoicesController.cancel);

export default router;
