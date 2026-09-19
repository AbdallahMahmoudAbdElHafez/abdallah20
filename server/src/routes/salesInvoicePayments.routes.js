import { Router } from "express";
import * as controller from "../controllers/salesInvoicePayments.controller.js";
import { SalesInvoicePayment, SalesInvoice, Party, City, Employee } from "../models/index.js";
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
            include: [
                {
                    model: SalesInvoice,
                    as: "sales_invoice",
                    include: [
                        {
                            model: Party,
                            as: "party",
                            include: [{
                                model: City,
                                as: "city",
                                attributes: ["id", "name"]
                            }]
                        },
                        {
                            model: SalesInvoicePayment,
                            as: "payments",
                            attributes: ["id", "amount", "withholding_tax_amount"]
                        }
                    ]
                },
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["id", "name"]
                }
            ],
            order: [["payment_date", "DESC"]],
        });

        const result = payments.map(p => {
            const plain = p.toJSON();
            if (plain.sales_invoice) {
                const invoicePayments = plain.sales_invoice.payments || [];
                const totalPaid = invoicePayments.reduce((sum, pay) => sum + Number(pay.amount || 0), 0);
                const totalAmount = Number(plain.sales_invoice.total_amount || 0);
                plain.sales_invoice.total_paid = totalPaid;
                plain.sales_invoice.remaining_amount = Math.max(0, totalAmount - totalPaid);
            }
            return plain;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post("/", controller.createPayment);
router.get("/detail/:paymentId", controller.getPaymentDetail);
router.put("/:paymentId", controller.updatePayment);
router.delete("/:paymentId", controller.deletePayment);
router.get("/:invoiceId", controller.getPayments);

export default router;
