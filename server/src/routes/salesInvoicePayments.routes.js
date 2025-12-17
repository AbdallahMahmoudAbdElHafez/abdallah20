import { Router } from "express";
import * as controller from "../controllers/salesInvoicePayments.controller.js";
import { SalesInvoicePayment, SalesInvoice, Party } from "../models/index.js";
import { Op } from "sequelize";

const router = Router();

router.get("/all", async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const whereClause = {};

        if (startDate && endDate) {
            whereClause.payment_date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const payments = await SalesInvoicePayment.findAll({
            where: whereClause,
            include: [{
                model: SalesInvoice,
                as: "sales_invoice",
                include: [{ model: Party, as: "party" }]
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
