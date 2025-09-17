import { Router } from "express";
import * as controller from "../controllers/purchasePayment.controller.js";

const router = Router();

router.post("/", controller.createPayment);
router.get("/:invoiceId", controller.getPayments);
router.get("/detail/:paymentId", controller.getPaymentDetail);

export default router;
