import { getCustomerStatement } from "../services/customerLedger.service.js";

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
