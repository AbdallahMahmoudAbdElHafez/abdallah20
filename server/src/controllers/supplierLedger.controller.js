import { getSupplierStatement } from "../services/supplierLedger.service.js";

export async function getStatement(req, res, next) {
  try {
    const { from, to } = req.query;
    const supplierId = req.params.id;

    const result = await getSupplierStatement(supplierId, {
      from,
      to,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}
