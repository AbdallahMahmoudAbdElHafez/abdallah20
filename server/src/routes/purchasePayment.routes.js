import { Router } from "express";
import * as controller from "../controllers/purchasePayment.controller.js";
import { PurchaseInvoicePayment, PurchaseInvoice } from "../models/index.js"; // ✅ استيراد الموديلات

const router = Router();

// ✅ يجب أن يكون /all قبل /:invoiceId عشان ما يتفسرش كـ invoiceId
router.get("/all", async (req, res, next) => {
    try {
        const payments = await PurchaseInvoicePayment.findAll({
            include: [{
                model: PurchaseInvoice,
                as: "purchase_invoice",
            }], // لو عندك alias اذكره
            order: [["payment_date", "DESC"]],
        });
        res.json(payments);
    } catch (err) {
        next(err);
    }
});

router.post("/", controller.createPayment);
router.get("/detail/:paymentId", controller.getPaymentDetail);
router.put("/:paymentId", controller.updatePayment);
router.get("/:invoiceId", controller.getPayments);
export default router;
