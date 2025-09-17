import { Router } from "express";
import * as controller from "../controllers/supplierCheque.controller.js";

const router = Router();

router.post("/", controller.addCheque);
router.patch("/:id", controller.updateCheque);
router.get("/:id", controller.getChequeDetail);

export default router;
