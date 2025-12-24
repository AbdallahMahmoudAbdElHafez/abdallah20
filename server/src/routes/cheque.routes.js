import express from "express";
import * as chequeController from "../controllers/cheque.controller.js";

const router = express.Router();

router.get("/", chequeController.listCheques);
router.put("/:id/status", chequeController.updateChequeStatus);

export default router;
