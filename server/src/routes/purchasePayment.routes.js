import { Router } from "express";
import * as controller from "../controllers/purchasePayment.controller.js";

const router = Router();

router.post("/", controller.createPayment);
router.get("/detail/:paymentId", controller.getPaymentDetail);
router.get("/:invoiceId", controller.getPayments);

export default router;
