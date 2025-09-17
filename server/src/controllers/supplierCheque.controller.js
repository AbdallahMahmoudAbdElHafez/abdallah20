import * as chequeService from "../services/supplierCheque.service.js";

export async function addCheque(req, res, next) {
  try {
    const cheque = await chequeService.addCheque(req.body);
    res.status(201).json(cheque);
  } catch (err) {
    next(err);
  }
}

export async function updateCheque(req, res, next) {
  try {
    const updated = await chequeService.updateChequeStatus(
      req.params.id,
      req.body.status
    );
    res.json({ updated });
  } catch (err) {
    next(err);
  }
}
export async function getChequeDetail(req, res, next) {
  try {
    const cheque = await chequeService.getChequeById(req.params.id);
    if (!cheque) return res.status(404).json({ message: "Cheque not found" });
    res.json(cheque);
  } catch (err) {
    next(err);
  }
}