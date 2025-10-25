import ExternalWorkOrderReceiptService from '../services/externalWorkOrderReceipt.service.js';

class ExternalWorkOrderReceiptController {
static async getAll(req, res) {
try {
const data = await ExternalWorkOrderReceiptService.getAll();
res.json(data);
} catch (err) {
res.status(500).json({ error: err.message });
}
}

static async create(req, res) {
try {
const data = await ExternalWorkOrderReceiptService.create(req.body);
res.status(201).json(data);
} catch (err) {
res.status(500).json({ error: err.message });
}
}

static async delete(req, res) {
try {
await ExternalWorkOrderReceiptService.delete(req.params.id);
res.json({ message: 'Deleted' });
} catch (err) {
res.status(500).json({ error: err.message });
}
}
}

export default ExternalWorkOrderReceiptController;