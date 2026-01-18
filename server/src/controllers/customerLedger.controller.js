import { getCustomerStatement } from "../services/customerLedger.service.js";
import exportService from "../services/exportService.js";

export async function getStatement(req, res, next) {
    try {
        const { from, to } = req.query;
        const customerId = req.params.id;

        const result = await getCustomerStatement(customerId, { from, to });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function exportStatement(req, res, next) {
    try {
        const { from, to } = req.query;
        const customerId = req.params.id;

        const result = await getCustomerStatement(customerId, { from, to });
        const buffer = await exportService.exportCustomerStatement(result);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="Customer_Statement_${customerId}.xlsx"`);
        res.send(buffer);
    } catch (err) {
        next(err);
    }
}
