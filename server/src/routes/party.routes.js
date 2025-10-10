// server/src/routes/party.routes.js
import { Router } from "express";
import partyController from "../controllers/party.controller.js";
const router = Router();

// GET /api/parties
router.get("/", partyController.getAll);
router.get("/suppliers", partyController.getSuppliers);

// GET /api/parties/:id
router.get("/:id", partyController.getById);

// POST /api/parties
router.post("/", partyController.create);

// PUT /api/parties/:id
router.put("/:id", partyController.update);

// DELETE /api/parties/:id
router.delete("/:id", partyController.delete);

export default router;
