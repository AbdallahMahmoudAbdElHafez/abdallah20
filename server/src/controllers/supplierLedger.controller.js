import { getSupplierStatement } from "../services/supplierLedger.service.js";
import exportService from "../services/exportService.js";

export async function getStatement(req, res, next) {
  try {
    const { from, to } = req.query;
    const supplierId = req.params.id;

    const result = await getSupplierStatement(supplierId, { from, to });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function exportStatement(req, res, next) {
  try {
    const { from, to } = req.query;
    const supplierId = req.params.id;

    const result = await getSupplierStatement(supplierId, { from, to });
    const buffer = await exportService.exportSupplierStatement(result);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Supplier_Statement_${supplierId}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
