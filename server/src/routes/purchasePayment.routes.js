import { Router } from "express";
import * as controller from "../controllers/purchasePayment.controller.js";
import { PurchaseInvoicePayment, PurchaseInvoice, Party } from "../models/index.js"; // ✅ استيراد الموديلات
import { Op } from "sequelize";

const router = Router();

// ✅ يجب أن يكون /all قبل /:invoiceId عشان ما يتفسرش كـ invoiceId
router.get("/all", async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const whereClause = {};

        if (startDate && endDate) {
            whereClause.payment_date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const payments = await PurchaseInvoicePayment.findAll({
            where: whereClause,
            include: [{
                model: PurchaseInvoice,
                as: "purchase_invoice",
                include: [{ model: Party, as: "supplier" }]
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
