import { Router } from "express";
import * as controller from "../controllers/salesInvoicePayments.controller.js";
import { SalesInvoicePayment, SalesInvoice } from "../models/index.js";

const router = Router();

router.get("/all", async (req, res, next) => {
    try {
        const payments = await SalesInvoicePayment.findAll({
            include: [{
                model: SalesInvoice,
                as: "sales_invoice",
            }],
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
