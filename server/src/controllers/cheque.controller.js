import * as chequeService from "../services/cheque.service.js";

export async function listCheques(req, res) {
    try {
        const cheques = await chequeService.listCheques(req.query);
        res.json(cheques);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateChequeStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const cheque = await chequeService.updateChequeStatus(id, status);
        res.json(cheque);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
