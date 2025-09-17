import { SupplierCheque } from "../models/index.js";

export async function addCheque(data) {
  return SupplierCheque.create(data);
}

export async function updateChequeStatus(id, status) {
  return SupplierCheque.update({ status }, { where: { id } });
}
export async function getPaymentById(id) {
  return PurchaseInvoicePayment.findByPk(id, {
    include: [{ model: SupplierCheque, as: "cheques" }],
  });
}
export async function getChequeById(id) {
  return SupplierCheque.findByPk(id);
}