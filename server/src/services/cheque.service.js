import { Cheque, Account, SalesInvoicePayment, PurchaseInvoicePayment } from "../models/index.js";

export async function createCheque(data, transaction) {
    return await Cheque.create(data, { transaction });
}

export async function getChequeById(id) {
    return await Cheque.findByPk(id, {
        include: [
            { model: Account, as: 'account' }
        ]
    });
}

export async function updateChequeStatus(id, status, transaction) {
    const cheque = await Cheque.findByPk(id, { transaction });
    if (!cheque) throw new Error("Cheque not found");

    // Here we might want to handle journal entries for status changes (e.g., deposited -> cleared)
    // For now, just update status.
    return await cheque.update({ status }, { transaction });
}

export async function listCheques(filters = {}) {
    const where = {};
    if (filters.cheque_type) where.cheque_type = filters.cheque_type;
    if (filters.status) where.status = filters.status;

    return await Cheque.findAll({ where, include: [{ model: Account, as: 'account' }] });
}
