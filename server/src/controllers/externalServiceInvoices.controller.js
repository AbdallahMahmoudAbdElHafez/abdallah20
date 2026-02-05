// src/controllers/externalServiceInvoices.controller.js
import ExternalServiceInvoicesService from "../services/externalServiceInvoices.service.js";

const ExternalServiceInvoicesController = {
    getAll: async (req, res) => {
        try {
            const invoices = await ExternalServiceInvoicesService.getAll();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const invoice = await ExternalServiceInvoicesService.getById(req.params.id);
            if (!invoice) return res.status(404).json({ error: "Invoice not found" });
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getByJobOrderId: async (req, res) => {
        try {
            const invoices = await ExternalServiceInvoicesService.getByJobOrderId(req.params.jobOrderId);
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const invoice = await ExternalServiceInvoicesService.create(req.body);
            res.status(201).json(invoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const invoice = await ExternalServiceInvoicesService.update(req.params.id, req.body);
            res.json(invoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    remove: async (req, res) => {
        try {
            const result = await ExternalServiceInvoicesService.remove(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    post: async (req, res) => {
        try {
            const userId = req.body.user_id || null;
            const invoice = await ExternalServiceInvoicesService.post(req.params.id, userId);
            res.json(invoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    cancel: async (req, res) => {
        try {
            const userId = req.body.user_id || null;
            const invoice = await ExternalServiceInvoicesService.cancel(req.params.id, userId);
            res.json(invoice);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

export default ExternalServiceInvoicesController;
